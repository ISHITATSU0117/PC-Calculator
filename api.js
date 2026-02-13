// GitHub API連携

const GitHubAPI = {
    // GitHub APIのベースURL
    getBaseUrl(owner, repo) {
        return `https://api.github.com/repos/${owner}/${repo}/contents`;
    },
    
    // 認証ヘッダーを取得
    getHeaders(token) {
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        if (token) {
            headers['Authorization'] = `token ${token}`;
        }
        return headers;
    },
    
    // CSVファイル一覧を取得
    async listCSVFiles() {
        const config = ConfigManager.load();
        if (!config.owner || !config.repo) {
            throw new Error('GitHub設定が完了していません');
        }
        
        const url = `${this.getBaseUrl(config.owner, config.repo)}/${config.csvDir}?ref=${config.branch}`;
        const headers = this.getHeaders(config.token);
        
        try {
            const response = await fetch(url, { headers });
            
            if (!response.ok) {
                if (response.status === 404) {
                    // ディレクトリが存在しない場合は空配列を返す
                    return [];
                }
                throw new Error(`HTTPエラー: ${response.status}`);
            }
            
            const files = await response.json();
            
            // CSVファイルのみをフィルタリング し、さらに有効なファイル名のみを残す
            // Note: Calculator.isValidFileNameと同じ検証ロジック（依存関係の都合で重複）
            const csvFiles = files.filter(file => {
                if (file.type !== 'file' || !file.name.endsWith('.csv')) {
                    return false;
                }
                // ファイル名の有効性チェック: (PC|CO)数字(START|GOAL)を_で接続
                const baseName = file.name.replace('.csv', '');
                const sections = baseName.split('_');
                
                // 各セクションが正しい形式かチェック
                for (const section of sections) {
                    if (!section.match(/^(PC|CO)\d+(START|GOAL)$/i)) {
                        console.log(`無効なファイル名をスキップ: ${file.name}`);
                        return false;
                    }
                }
                
                return sections.length > 0;
            });
            
            // 各ファイルのコミット情報を取得
            // Note: これはN個のファイルに対してN個のAPIリクエストを発行しますが、
            // Promise.allにより並列実行されるため、シーケンシャルなN+1問題よりは効率的です
            // GitHub APIのレート制限: 認証済み5000req/h、未認証60req/h
            const filesWithCommits = await Promise.all(
                csvFiles.map(async (file) => {
                    try {
                        const commitUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/commits?path=${config.csvDir}/${file.name}&page=1&per_page=1`;
                        const commitResponse = await fetch(commitUrl, { headers });
                        
                        if (commitResponse.ok) {
                            const commits = await commitResponse.json();
                            if (commits.length > 0) {
                                file.lastCommit = commits[0];
                            }
                        }
                    } catch (error) {
                        console.error(`コミット情報取得エラー (${file.name}):`, error);
                    }
                    return file;
                })
            );
            
            return filesWithCommits;
        } catch (error) {
            console.error('ファイル一覧取得エラー:', error);
            throw error;
        }
    },
    
    // CSVファイルの内容を取得
    async getCSVContent(fileName) {
        const config = ConfigManager.load();
        const url = `${this.getBaseUrl(config.owner, config.repo)}/${config.csvDir}/${fileName}?ref=${config.branch}`;
        const headers = this.getHeaders(config.token);
        
        try {
            const response = await fetch(url, { headers });
            
            if (!response.ok) {
                throw new Error(`HTTPエラー: ${response.status}`);
            }
            
            const fileData = await response.json();
            
            // Base64デコード
            const content = atob(fileData.content.replace(/\n/g, ''));
            
            return {
                content: content,
                sha: fileData.sha,
                name: fileData.name
            };
        } catch (error) {
            console.error('ファイル取得エラー:', error);
            throw error;
        }
    },
    
    // すべてのCSVファイルを取得
    async getAllCSVData() {
        const files = await this.listCSVFiles();
        const csvData = {};
        
        for (const file of files) {
            try {
                const fileData = await this.getCSVContent(file.name);
                csvData[file.name] = fileData.content;
            } catch (error) {
                console.error(`${file.name}の取得に失敗:`, error);
            }
        }
        
        return csvData;
    },
    
    // CSVファイルをアップロード（作成または更新）
    async uploadCSVFile(fileName, content) {
        const config = ConfigManager.load();
        if (!config.token) {
            throw new Error('GitHub Personal Access Tokenが設定されていません');
        }
        
        const url = `${this.getBaseUrl(config.owner, config.repo)}/${config.csvDir}/${fileName}`;
        const headers = this.getHeaders(config.token);
        headers['Content-Type'] = 'application/json';
        
        // 既存ファイルのSHAを取得（更新の場合に必要）
        let sha = null;
        try {
            const existing = await this.getCSVContent(fileName);
            sha = existing.sha;
        } catch (error) {
            // ファイルが存在しない場合は新規作成
        }
        
        const body = {
            message: `Upload ${fileName}`,
            content: btoa(unescape(encodeURIComponent(content))),  // UTF-8をBase64にエンコード
            branch: config.branch
        };
        
        if (sha) {
            body.sha = sha;  // 更新の場合はSHAが必要
        }
        
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`アップロード失敗: ${errorData.message || response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('アップロードエラー:', error);
            throw error;
        }
    },
    
    // CSVファイルを削除
    async deleteCSVFile(fileName, sha) {
        const config = ConfigManager.load();
        if (!config.token) {
            throw new Error('GitHub Personal Access Tokenが設定されていません');
        }
        
        const url = `${this.getBaseUrl(config.owner, config.repo)}/${config.csvDir}/${fileName}`;
        const headers = this.getHeaders(config.token);
        headers['Content-Type'] = 'application/json';
        
        const body = {
            message: `Delete ${fileName}`,
            sha: sha,
            branch: config.branch
        };
        
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: headers,
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`削除失敗: ${errorData.message || response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('削除エラー:', error);
            throw error;
        }
    },
    
    // ファイル情報を取得（SHAとメタデータ）
    async getFileInfo(fileName) {
        const config = ConfigManager.load();
        const url = `${this.getBaseUrl(config.owner, config.repo)}/${config.csvDir}/${fileName}`;
        const headers = this.getHeaders(config.token);
        
        try {
            const response = await fetch(url, { headers });
            
            if (!response.ok) {
                throw new Error(`HTTPエラー: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('ファイル情報取得エラー:', error);
            throw error;
        }
    }
};
