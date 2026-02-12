// CSV解析と計算ロジック

const Calculator = {
    // ファイル名が有効かどうかをチェック
    // 有効な形式: (PC|CO)数字(START|GOAL) を_で接続したもののみ
    // 例: PC1START.csv, PC1GOAL_PC2START.csv
    isValidFileName(filename) {
        // 拡張子を除去
        const baseName = filename.replace('.csv', '');
        
        // "_" で分割
        const sections = baseName.split('_');
        
        // 各セクションが正しい形式かチェック
        for (const section of sections) {
            // PC or CO + 数字 + START or GOAL の形式のみ許可
            if (!section.match(/^(PC|CO)\d+(START|GOAL)$/i)) {
                return false;
            }
        }
        
        // すべてのセクションが有効なら true
        return sections.length > 0;
    },

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

    // ファイル名の区間重複をチェック
    checkOverlap(parsedData) {
        const overlaps = [];
        const files = Object.keys(parsedData);
        
        // 各ファイルのすべての区間情報を取得
        const fileIntervals = {};
        for (const filename of files) {
            const fileInfo = this.parseFileName(filename);
            if (fileInfo.length > 0) {
                fileIntervals[filename] = fileInfo;
            }
        }
        
        // すべてのファイルペアをチェック
        for (let i = 0; i < files.length; i++) {
            for (let j = i + 1; j < files.length; j++) {
                const file1 = files[i];
                const file2 = files[j];
                const intervals1 = fileIntervals[file1] || [];
                const intervals2 = fileIntervals[file2] || [];
                
                // 各ファイル内の区間同士を比較
                for (const int1 of intervals1) {
                    for (const int2 of intervals2) {
                        // 同じ区間かつ同じタイプ（START/GOAL）の場合は重複
                        if (int1.section === int2.section && int1.type === int2.type) {
                            overlaps.push({
                                file1: file1,
                                file2: file2,
                                section: int1.section,
                                type: int1.type
                            });
                        }
                    }
                }
            }
        }
        
        return overlaps;
    },

    // ゼッケンごとのデータを構築
    buildBibData(parsedData, sections, overlaps) {
        const bibMap = new Map();
        
        // 重複している区間をSetに格納（高速検索用）
        const overlappingIntervals = new Set();
        overlaps.forEach(overlap => {
            overlappingIntervals.add(`${overlap.section}_${overlap.type}`);
        });

        // ゼッケン番号の重複を検出するための構造
        // key: "section_type_bibNumber", value: [filename1, filename2, ...]
        const bibDuplicates = {};

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
                        const key = `${section.section}_START`;
                        const isDuplicate = overlappingIntervals.has(key);
                        
                        // 重複していない場合のみ時刻を設定
                        if (!isDuplicate) {
                            // ゼッケン番号の重複をチェック
                            const bibKey = `${section.section}_START_${bibNumber}`;
                            if (!bibDuplicates[bibKey]) {
                                bibDuplicates[bibKey] = [];
                            }
                            bibDuplicates[bibKey].push(filename);
                            
                            // 同じゼッケンが同じ区間に複数回出現していない場合のみ設定
                            if (bibDuplicates[bibKey].length === 1) {
                                sectionData.startTime = record.time;
                            } else {
                                // 重複が検出されたら時刻をクリア
                                sectionData.startTime = null;
                            }
                        }
                    }
                    if (filename === section.goalFile) {
                        const key = `${section.section}_GOAL`;
                        const isDuplicate = overlappingIntervals.has(key);
                        
                        // 重複していない場合のみ時刻を設定
                        if (!isDuplicate) {
                            // ゼッケン番号の重複をチェック
                            const bibKey = `${section.section}_GOAL_${bibNumber}`;
                            if (!bibDuplicates[bibKey]) {
                                bibDuplicates[bibKey] = [];
                            }
                            bibDuplicates[bibKey].push(filename);
                            
                            // 同じゼッケンが同じ区間に複数回出現していない場合のみ設定
                            if (bibDuplicates[bibKey].length === 1) {
                                sectionData.goalTime = record.time;
                            } else {
                                // 重複が検出されたら時刻をクリア
                                sectionData.goalTime = null;
                            }
                        }
                    }
                });
            });
        }

        // ゼッケン番号の重複情報を収集
        const bibNumberDuplicates = [];
        for (const [key, files] of Object.entries(bibDuplicates)) {
            if (files.length > 1) {
                const parts = key.split('_');
                const section = parts[0] + parts[1]; // e.g., "PC1"
                const type = parts[2]; // "START" or "GOAL"
                const bibNumber = parts[3];
                bibNumberDuplicates.push({
                    section: section,
                    type: type,
                    bibNumber: bibNumber,
                    files: files
                });
            }
        }

        // ゼッケン番号でソート
        const bibData = Array.from(bibMap.values()).sort((a, b) => {
            const aNum = parseInt(a.bibNumber);
            const bNum = parseInt(b.bibNumber);
            return aNum - bNum;
        });

        return { bibData, bibNumberDuplicates };
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
                    sections: [],
                    overlaps: [],
                    bibNumberDuplicates: []
                };
            }

            // すべてのCSVをパース
            const parsedData = {};
            for (const [filename, content] of Object.entries(csvData)) {
                parsedData[filename] = this.parseCSV(filename, content);
            }

            // 区間の重複をチェック
            const overlaps = this.checkOverlap(parsedData);

            // 区間情報を構築
            const sections = this.buildSections(parsedData);

            // ゼッケンごとのデータを構築（重複情報も含む）
            const { bibData, bibNumberDuplicates } = this.buildBibData(parsedData, sections, overlaps);

            // 通過時間を計算
            this.calculateDurations(bibData, sections);

            // 最終計算時刻を保存
            ConfigManager.saveLastCalculation();

            return {
                success: true,
                bibData: bibData,
                sections: sections,
                fileCount: Object.keys(csvData).length,
                overlaps: overlaps,
                bibNumberDuplicates: bibNumberDuplicates
            };
        } catch (error) {
            console.error('計算エラー:', error);
            return {
                success: false,
                error: error.message,
                bibData: [],
                sections: [],
                overlaps: [],
                bibNumberDuplicates: []
            };
        }
    }
};
