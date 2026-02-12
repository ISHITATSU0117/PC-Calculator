// アプリケーション設定

const CONFIG = {
    // GitHub設定
    // デフォルト設定: すべてのユーザーが同じリポジトリの結果を閲覧できるようにする
    // 管理者は管理画面でこれらの値を上書きできます
    GITHUB_OWNER: 'ishitatsu0117',  // デフォルト: 'ishitatsu0117'
    GITHUB_REPO: 'PC-Calculator',   // デフォルト: 'PC-Calculator'
    GITHUB_BRANCH: 'main',
    CSV_DIRECTORY: 'csv',  // CSVファイルを保存するディレクトリ
    
    // 自動更新設定
    AUTO_REFRESH_INTERVAL: 120000,  // 120秒（2分）
    
    // ローカルストレージキー
    STORAGE_KEYS: {
        GITHUB_TOKEN: 'github_token',
        GITHUB_OWNER: 'github_owner',
        GITHUB_REPO: 'github_repo',
        GITHUB_BRANCH: 'github_branch',
        CSV_DIRECTORY: 'csv_directory',
        LAST_CALCULATION: 'last_calculation_time'
    }
};

// 設定の取得と保存
const ConfigManager = {
    // 設定を読み込み
    load() {
        const stored = {
            token: localStorage.getItem(CONFIG.STORAGE_KEYS.GITHUB_TOKEN) || '',
            owner: localStorage.getItem(CONFIG.STORAGE_KEYS.GITHUB_OWNER) || CONFIG.GITHUB_OWNER,
            repo: localStorage.getItem(CONFIG.STORAGE_KEYS.GITHUB_REPO) || CONFIG.GITHUB_REPO,
            branch: localStorage.getItem(CONFIG.STORAGE_KEYS.GITHUB_BRANCH) || CONFIG.GITHUB_BRANCH,
            csvDir: localStorage.getItem(CONFIG.STORAGE_KEYS.CSV_DIRECTORY) || CONFIG.CSV_DIRECTORY
        };
        return stored;
    },
    
    // 設定を保存
    save(config) {
        if (config.token !== undefined) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.GITHUB_TOKEN, config.token);
        }
        if (config.owner !== undefined) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.GITHUB_OWNER, config.owner);
        }
        if (config.repo !== undefined) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.GITHUB_REPO, config.repo);
        }
        if (config.branch !== undefined) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.GITHUB_BRANCH, config.branch);
        }
        if (config.csvDir !== undefined) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.CSV_DIRECTORY, config.csvDir);
        }
    },
    
    // 設定が完了しているか確認
    isConfigured() {
        const config = this.load();
        return config.owner && config.repo;
    },
    
    // 最終計算時刻を保存
    saveLastCalculation() {
        const now = new Date().toISOString();
        localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_CALCULATION, now);
    },
    
    // 最終計算時刻を取得
    getLastCalculation() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.LAST_CALCULATION);
    }
};
