// CSV解析と計算ロジック

const Calculator = {
    // CSVをパース
    parseCSV(filename, content) {
        const lines = content.trim().split('\n');
        const data = [];

        for (let i = 1; i < lines.length; i++) { // ヘッダーをスキップ
            const line = lines[i].trim();
            if (!line) continue;

            const values = line.split(',');
            if (values.length >= 4) {
                const entry = {
                    measurer: values[0].trim(),
                    type: values[1].trim(),
                    time: values[2].trim(),
                    number: values[3].trim()
                };

                // number が入力されている場合のみ追加
                if (entry.number) {
                    data.push(entry);
                }
            }
        }

        return data;
    },

    // ファイル名から区間情報を抽出
    parseFileName(filename) {
        // 拡張子を除去
        const baseName = filename.replace('.csv', '');

        // "_" で分割して複数の区間を処理
        const sections = baseName.split('_');
        const results = [];

        sections.forEach(section => {
            // PC1START または CO1GOAL などを解析
            const match = section.match(/^(PC|CO)(\d+)(START|GOAL)$/i);
            if (match) {
                results.push({
                    category: match[1].toUpperCase(),
                    number: parseInt(match[2]),
                    type: match[3].toUpperCase(),
                    section: `${match[1]}${match[2]}`
                });
            }
        });

        return results;
    },

    // 区間情報を構築
    buildSections(parsedData) {
        const sectionMap = new Map();

        for (const filename of Object.keys(parsedData)) {
            const fileInfo = this.parseFileName(filename);

            fileInfo.forEach(info => {
                const key = info.section;
                if (!sectionMap.has(key)) {
                    sectionMap.set(key, {
                        category: info.category,
                        number: info.number,
                        section: info.section,
                        startFile: null,
                        goalFile: null
                    });
                }

                const section = sectionMap.get(key);
                if (info.type === 'START') {
                    section.startFile = filename;
                } else if (info.type === 'GOAL') {
                    section.goalFile = filename;
                }
            });
        }

        // ソート: PC1, PC2, ..., CO1, CO2, ...
        const sections = Array.from(sectionMap.values()).sort((a, b) => {
            if (a.category !== b.category) {
                return a.category === 'PC' ? -1 : 1;
            }
            return a.number - b.number;
        });

        return sections;
    },

    // ゼッケンごとのデータを構築
    buildBibData(parsedData, sections) {
        const bibMap = new Map();

        for (const [filename, records] of Object.entries(parsedData)) {
            records.forEach(record => {
                const bibNumber = record.number;
                if (!bibMap.has(bibNumber)) {
                    bibMap.set(bibNumber, {
                        bibNumber: bibNumber,
                        sections: {}
                    });
                }

                const bibData = bibMap.get(bibNumber);

                // このファイルがどの区間に対応するか判定
                sections.forEach(section => {
                    if (!bibData.sections[section.section]) {
                        bibData.sections[section.section] = {
                            startTime: null,
                            goalTime: null,
                            duration: null
                        };
                    }

                    const sectionData = bibData.sections[section.section];

                    if (filename === section.startFile) {
                        sectionData.startTime = record.time;
                    }
                    if (filename === section.goalFile) {
                        sectionData.goalTime = record.time;
                    }
                });
            });
        }

        // ゼッケン番号でソート
        const bibData = Array.from(bibMap.values()).sort((a, b) => {
            const aNum = parseInt(a.bibNumber);
            const bNum = parseInt(b.bibNumber);
            return aNum - bNum;
        });

        return bibData;
    },

    // 通過時間を計算
    calculateDurations(bibData, sections) {
        bibData.forEach(bib => {
            sections.forEach(section => {
                const sectionData = bib.sections[section.section];
                if (sectionData && sectionData.startTime && sectionData.goalTime) {
                    const startSeconds = this.timeToSeconds(sectionData.startTime);
                    const goalSeconds = this.timeToSeconds(sectionData.goalTime);
                    if (startSeconds !== null && goalSeconds !== null) {
                        sectionData.duration = (goalSeconds - startSeconds).toFixed(2);
                    }
                }
            });
        });
    },

    // 時刻を秒に変換（HH:MM:SS.ms 形式）
    timeToSeconds(timeStr) {
        try {
            const parts = timeStr.split(':');
            if (parts.length !== 3) return null;

            const hours = parseInt(parts[0]);
            const minutes = parseInt(parts[1]);
            const seconds = parseFloat(parts[2]);

            return hours * 3600 + minutes * 60 + seconds;
        } catch (error) {
            console.error('時刻変換エラー:', timeStr, error);
            return null;
        }
    },

    // メイン計算処理
    async calculate() {
        try {
            // GitHubからすべてのCSVデータを取得
            const csvData = await GitHubAPI.getAllCSVData();
            
            if (Object.keys(csvData).length === 0) {
                return {
                    success: false,
                    error: 'CSVファイルが見つかりません',
                    bibData: [],
                    sections: []
                };
            }

            // すべてのCSVをパース
            const parsedData = {};
            for (const [filename, content] of Object.entries(csvData)) {
                parsedData[filename] = this.parseCSV(filename, content);
            }

            // 区間情報を構築
            const sections = this.buildSections(parsedData);

            // ゼッケンごとのデータを構築
            const bibData = this.buildBibData(parsedData, sections);

            // 通過時間を計算
            this.calculateDurations(bibData, sections);

            // 最終計算時刻を保存
            ConfigManager.saveLastCalculation();

            return {
                success: true,
                bibData: bibData,
                sections: sections,
                fileCount: Object.keys(csvData).length
            };
        } catch (error) {
            console.error('計算エラー:', error);
            return {
                success: false,
                error: error.message,
                bibData: [],
                sections: []
            };
        }
    },
    
    // 計算を実行してGitHubに結果を保存
    async calculateAndSave() {
        try {
            const result = await this.calculate();
            
            if (result.success) {
                // 結果データに計算時刻を追加
                const resultsData = {
                    calculatedAt: new Date().toISOString(),
                    fileCount: result.fileCount,
                    bibData: result.bibData,
                    sections: result.sections
                };
                
                // GitHubに結果を保存
                await GitHubAPI.saveCalculationResults(resultsData);
            }
            
            return result;
        } catch (error) {
            console.error('計算・保存エラー:', error);
            return {
                success: false,
                error: error.message,
                bibData: [],
                sections: []
            };
        }
    },
    
    // 保存された結果を取得（なければ計算する）
    async getResults() {
        try {
            // 保存された結果を取得
            const savedResults = await GitHubAPI.getCalculationResults();
            
            if (savedResults) {
                return {
                    success: true,
                    bibData: savedResults.bibData,
                    sections: savedResults.sections,
                    fileCount: savedResults.fileCount,
                    calculatedAt: savedResults.calculatedAt,
                    fromCache: true
                };
            }
            
            // 保存された結果がない場合は計算する
            const result = await this.calculate();
            return {
                ...result,
                fromCache: false
            };
        } catch (error) {
            console.error('結果取得エラー:', error);
            return {
                success: false,
                error: error.message,
                bibData: [],
                sections: []
            };
        }
    }
};
