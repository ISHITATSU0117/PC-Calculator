// アプリケーション設定

const CONFIG = {
    // GitHub設定（固定値）
    GITHUB_OWNER: 'ishitatsu0117',  // 固定値
    GITHUB_REPO: 'PC-Calculator',   // 固定値
    GITHUB_BRANCH: 'main',          // 固定値
    CSV_DIRECTORY: 'csv',           // 固定値
    
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
            owner: CONFIG.GITHUB_OWNER,  // 固定値を使用
            repo: CONFIG.GITHUB_REPO,    // 固定値を使用
            branch: CONFIG.GITHUB_BRANCH, // 固定値を使用
            csvDir: CONFIG.CSV_DIRECTORY  // 固定値を使用
        };
        return stored;
    },
    
    // 設定を保存（トークンのみ）
    save(config) {
        if (config.token !== undefined) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.GITHUB_TOKEN, config.token);
        }
        // owner, repo, branch, csvDirは固定値のため保存しない
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
