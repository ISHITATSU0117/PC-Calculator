# GitHubユーザー名変更ガイド

このドキュメントでは、GitHubユーザー名を変更した場合のPC-Calculatorアプリケーションへの影響と対応方法を説明します。

## 質問: GitHubユーザー名を変更しても正常に動作しますか？

### 回答: はい、自動的に対応します！ ✅

PC-Calculatorアプリケーションは、GitHubユーザー名の変更に自動的に対応するように設計されています。

## 🔄 自動検出機能

アプリケーションは以下の方法でGitHubユーザー名を自動的に検出します：

### 1. URLからの自動検出

GitHub Pagesの標準URL形式（`https://username.github.io/PC-Calculator/`）から、ユーザー名とリポジトリ名を自動的に抽出します。

**例:**
- URL: `https://newusername.github.io/PC-Calculator/`
- 検出されるユーザー名: `newusername`
- 検出されるリポジトリ名: `PC-Calculator`

### 2. 検出の優先順位

アプリケーションは以下の優先順位で設定を決定します：

1. **ローカルストレージに保存された設定**（カスタム設定がある場合）
2. **URLから自動検出した値**（GitHub Pages標準URL使用時）
3. **デフォルト値**（`ishitatsu0117/PC-Calculator`）

## 📋 ユーザー名変更時の手順

### GitHub Pagesを使用している場合（推奨）

GitHubユーザー名を変更すると、GitHub PagesのURLも自動的に変更されます。

#### 手順:

1. **GitHubでユーザー名を変更**
   - GitHub Settings → Account → Change username

2. **リポジトリURLが自動更新される**
   - 旧: `https://oldusername.github.io/PC-Calculator/`
   - 新: `https://newusername.github.io/PC-Calculator/`

3. **アプリケーションは自動的に新しいユーザー名を検出**
   - 新しいURLにアクセスすると、自動的に新しいユーザー名が使用されます
   - **追加の設定は不要です！**

4. **ブラウザのキャッシュをクリア**（推奨）
   ```
   Ctrl+Shift+R (Windows/Linux)
   Cmd+Shift+R (Mac)
   ```

5. **Personal Access Tokenの確認**
   - 既存のトークンは引き続き使用可能です
   - トークンは再設定不要です

### カスタムドメインを使用している場合

カスタムドメイン（例: `www.example.com`）を使用している場合は、自動検出ができません。

#### 手順:

1. **config.jsファイルを更新**
   ```javascript
   const CONFIG = {
       DEFAULT_GITHUB_OWNER: 'newusername',  // 新しいユーザー名に変更
       DEFAULT_GITHUB_REPO: 'PC-Calculator',
       // ...
   };
   ```

2. **変更をコミット＆プッシュ**
   ```bash
   git add config.js
   git commit -m "Update GitHub username to newusername"
   git push
   ```

3. **GitHub Actionsでデプロイを待つ**（1〜3分）

4. **ブラウザのキャッシュをクリア＆再読み込み**

## 🔍 設定の確認方法

ブラウザのコンソール（F12キー）で以下のコマンドを実行すると、現在の設定を確認できます：

```javascript
// 検出情報の確認
ConfigManager.getDetectionInfo()

// 現在使用中の設定
ConfigManager.load()
```

**出力例:**
```json
{
  "detectedOwner": "newusername",
  "detectedRepo": "PC-Calculator",
  "savedOwner": null,
  "savedRepo": null,
  "defaultOwner": "ishitatsu0117",
  "defaultRepo": "PC-Calculator",
  "currentOwner": "newusername",
  "currentRepo": "PC-Calculator"
}
```

## 🛠️ トラブルシューティング

### 問題: ユーザー名変更後もエラーが発生する

**原因:** ブラウザのキャッシュに古い設定が残っている

**解決策:**
1. ブラウザのハードリフレッシュ（Ctrl+Shift+R / Cmd+Shift+R）
2. ブラウザの開発者ツール（F12）→ Application → Local Storage → すべてクリア
3. ページを再読み込み

### 問題: カスタムドメインで自動検出が動作しない

**原因:** カスタムドメインからはGitHubユーザー名を抽出できません

**解決策:**
上記の「カスタムドメインを使用している場合」の手順に従ってconfig.jsを更新してください。

### 問題: ローカルストレージの設定を削除したい

**解決策:**
ブラウザのコンソールで以下を実行：

```javascript
// すべての設定をクリア
localStorage.removeItem('github_owner');
localStorage.removeItem('github_repo');
localStorage.removeItem('github_token');

// ページを再読み込み
location.reload();
```

## 📝 手動設定（上級者向け）

自動検出をオーバーライドして、手動で設定することも可能です：

```javascript
// ブラウザのコンソールで実行
ConfigManager.save({
    owner: 'your-custom-username',
    repo: 'your-custom-repo'
});

// 設定を確認
ConfigManager.load();
```

この方法は、複数のフォークを使用する場合や、テスト環境で異なるリポジトリを使用する場合に便利です。

## ⚠️ 重要な注意事項

1. **GitHubユーザー名変更後のリダイレクト**
   - GitHubは旧ユーザー名から新ユーザー名へのリダイレクトを自動的に設定します
   - ただし、リダイレクトは一時的なものなので、早めに新しいURLを使用してください

2. **データリポジトリのアクセス権限**
   - CSVデータを保存しているリポジトリへのアクセス権限を確認してください
   - Personal Access Tokenは引き続き有効ですが、権限を確認することをお勧めします

3. **既存のブックマークやリンク**
   - ユーザー名変更後は、ブックマークやドキュメントのリンクを更新してください
   - 古いURLはリダイレクトされますが、直接新しいURLを使用することを推奨します

## 🔗 関連ドキュメント

- [URL設定ガイド](URL_CONFIGURATION.md) - URLやドメインを変更する方法
- [デプロイメントガイド](DEPLOYMENT.md) - GitHub Pagesへのデプロイ方法
- [README](README.md) - アプリケーションの概要と使い方

---

**作成日**: 2026年2月  
**最終更新**: 2026年2月  
**バージョン**: 1.1.0
