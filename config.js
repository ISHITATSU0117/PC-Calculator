// アプリケーション設定

const CONFIG = {
    // GitHub設定のデフォルト値（フォールバック用）
    DEFAULT_GITHUB_OWNER: 'ishitatsu0117',  // デフォルト値（自動検出失敗時のフォールバック）
    DEFAULT_GITHUB_REPO: 'PC-Calculator',   // デフォルト値
    DEFAULT_DATA_GITHUB_REPO: '',           // データ保存用リポジトリ名（別途設定が必要）
    GITHUB_BRANCH: 'main',          // 固定値
    CSV_DIRECTORY: 'csv',           // 固定値
    SETTING_DIRECTORY: 'setting',   // 固定値
    
    // 自動更新設定
    AUTO_REFRESH_INTERVAL: 120000,  // 120秒（2分）
    
    // ローカルストレージキー
    STORAGE_KEYS: {
        GITHUB_TOKEN: 'github_token',
        GITHUB_OWNER: 'github_owner',           // カスタムオーナー設定用
        GITHUB_REPO: 'github_repo',             // カスタムリポジトリ設定用（制御用）
        DATA_GITHUB_OWNER: 'data_github_owner', // データ保存用リポジトリのオーナー
        DATA_GITHUB_REPO: 'data_github_repo',   // データ保存用リポジトリ名
        LAST_CALCULATION: 'last_calculation_time',
        CALCULATION_RESULTS: 'calculation_results'
    },
    
    // GitHub Pages URLからオーナー名を自動検出
    detectGitHubOwner() {
        const hostname = window.location.hostname;
        
        // GitHub Pagesの標準URL形式: username.github.io
        const githubPagesPattern = /^([a-zA-Z0-9-]+)\.github\.io$/i;
        const match = hostname.match(githubPagesPattern);
        
        if (match) {
            return match[1].toLowerCase();
        }
        
        // カスタムドメインまたはローカル環境の場合はnullを返す
        return null;
    },
    
    // GitHub Pages URLからリポジトリ名を自動検出
    detectGitHubRepo() {
        const pathname = window.location.pathname;
        
        // GitHub Pagesのプロジェクトサイト形式: /repository-name/
        // パス名から最初のセグメントを取得
        const pathSegments = pathname.split('/').filter(segment => segment.length > 0);
        
        if (pathSegments.length > 0) {
            return pathSegments[0];
        }
        
        // ルートパスの場合はnullを返す
        return null;
    }
};

// 設定の取得と保存
const ConfigManager = {
    // 設定を読み込み
    load() {
        // ローカルストレージから保存された設定を取得
        const savedOwner = localStorage.getItem(CONFIG.STORAGE_KEYS.GITHUB_OWNER);
        const savedRepo = localStorage.getItem(CONFIG.STORAGE_KEYS.GITHUB_REPO);
        const savedDataOwner = localStorage.getItem(CONFIG.STORAGE_KEYS.DATA_GITHUB_OWNER);
        const savedDataRepo = localStorage.getItem(CONFIG.STORAGE_KEYS.DATA_GITHUB_REPO);
        
        // オーナー名の決定優先順位:
        // 1. ローカルストレージに保存された値
        // 2. URLから自動検出した値
        // 3. デフォルト値
        let owner = savedOwner;
        if (!owner) {
            const detectedOwner = CONFIG.detectGitHubOwner();
            owner = detectedOwner || CONFIG.DEFAULT_GITHUB_OWNER;
        }
        
        // リポジトリ名の決定優先順位:
        // 1. ローカルストレージに保存された値
        // 2. URLから自動検出した値
        // 3. デフォルト値
        let repo = savedRepo;
        if (!repo) {
            const detectedRepo = CONFIG.detectGitHubRepo();
            repo = detectedRepo || CONFIG.DEFAULT_GITHUB_REPO;
        }

        // データ保存用リポジトリのオーナー（未設定の場合は制御用リポジトリのオーナーを使用）
        const dataOwner = savedDataOwner || owner;

        // データ保存用リポジトリ名（未設定の場合は空文字）
        const dataRepo = savedDataRepo || CONFIG.DEFAULT_DATA_GITHUB_REPO;
        
        const stored = {
            token: localStorage.getItem(CONFIG.STORAGE_KEYS.GITHUB_TOKEN) || '',
            owner: owner,
            repo: repo,
            dataOwner: dataOwner,
            dataRepo: dataRepo,
            branch: CONFIG.GITHUB_BRANCH,
            csvDir: CONFIG.CSV_DIRECTORY,
            settingDir: CONFIG.SETTING_DIRECTORY
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
        if (config.dataOwner !== undefined) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.DATA_GITHUB_OWNER, config.dataOwner);
        }
        if (config.dataRepo !== undefined) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.DATA_GITHUB_REPO, config.dataRepo);
        }
    },
    
    // 設定が完了しているか確認
    isConfigured() {
        const config = this.load();
        return config.owner && config.repo;
    },

    // データ保存用リポジトリの設定が完了しているか確認
    isDataRepoConfigured() {
        const config = this.load();
        return config.dataOwner && config.dataRepo;
    },
    
    // 検出された設定情報を取得（デバッグ用）
    getDetectionInfo() {
        return {
            detectedOwner: CONFIG.detectGitHubOwner(),
            detectedRepo: CONFIG.detectGitHubRepo(),
            savedOwner: localStorage.getItem(CONFIG.STORAGE_KEYS.GITHUB_OWNER),
            savedRepo: localStorage.getItem(CONFIG.STORAGE_KEYS.GITHUB_REPO),
            savedDataOwner: localStorage.getItem(CONFIG.STORAGE_KEYS.DATA_GITHUB_OWNER),
            savedDataRepo: localStorage.getItem(CONFIG.STORAGE_KEYS.DATA_GITHUB_REPO),
            defaultOwner: CONFIG.DEFAULT_GITHUB_OWNER,
            defaultRepo: CONFIG.DEFAULT_GITHUB_REPO,
            currentOwner: this.load().owner,
            currentRepo: this.load().repo,
            currentDataOwner: this.load().dataOwner,
            currentDataRepo: this.load().dataRepo
        };
    },
    
    // 最終計算時刻を保存
    saveLastCalculation() {
        const now = new Date().toISOString();
        localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_CALCULATION, now);
    },
    
    // 最終計算時刻を取得
    getLastCalculation() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.LAST_CALCULATION);
    },
    
    // 計算結果を保存
    saveCalculationResults(results) {
        try {
            const data = JSON.stringify(results);
            localStorage.setItem(CONFIG.STORAGE_KEYS.CALCULATION_RESULTS, data);
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('計算結果の保存エラー: ストレージ容量が不足しています', error);
            } else {
                console.error('計算結果の保存エラー:', error);
            }
        }
    },
    
    // 計算結果を取得
    getCalculationResults() {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE_KEYS.CALCULATION_RESULTS);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            if (error instanceof SyntaxError) {
                console.error('計算結果の取得エラー: JSONパースに失敗しました', error);
            } else {
                console.error('計算結果の取得エラー:', error);
            }
            return null;
        }
    }
};
