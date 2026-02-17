# URL設定ガイド

このドキュメントでは、PC-CalculatorアプリケーションのURLを変更する方法を説明します。

## 現在のURL

デフォルトのGitHub Pages URL:
```
https://ishitatsu0117.github.io/PC-Calculator/
```

## URL変更方法

### 方法1: カスタムドメインを使用する

カスタムドメイン（例: `www.example.com`）を使用したい場合:

1. **ドメインを取得**
   - お好みのドメインレジストラから独自ドメインを取得

2. **DNS設定を行う**
   
   ドメインのDNS設定で以下のいずれかを設定:
   
   **Apexドメイン（example.com）の場合:**
   ```
   A レコード:
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
   
   **サブドメイン（www.example.com）の場合:**
   ```
   CNAME レコード:
   ishitatsu0117.github.io
   ```

3. **GitHubリポジトリの設定**
   - リポジトリの Settings → Pages に移動
   - Custom domain フィールドにドメイン名を入力（例: `www.example.com`）
   - Save をクリック
   - "Enforce HTTPS" にチェックを入れる（推奨）

4. **ドキュメントを更新**
   
   以下のファイルのURLを新しいドメインに変更:
   - `README.md`
   - `DEPLOYMENT.md`
   - `QUICK_START_JA.md`
   - `HOW_TO_MERGE_PR_JA.md`

   変更例:
   ```markdown
   # 変更前
   https://ishitatsu0117.github.io/PC-Calculator/
   
   # 変更後
   https://www.example.com/
   ```

### 方法2: リポジトリ名を変更する

リポジトリ名を変更してURLを変更する場合:

1. **リポジトリ名を変更**
   - GitHubリポジトリの Settings に移動
   - Repository name フィールドで新しい名前を入力
   - Rename をクリック

2. **ローカルリポジトリを更新**
   ```bash
   git remote set-url origin https://github.com/ISHITATSU0117/<新しいリポジトリ名>.git
   ```

3. **config.jsを更新**
   
   `config.js` ファイルの設定を変更:
   ```javascript
   const CONFIG = {
       GITHUB_OWNER: 'ishitatsu0117',
       GITHUB_REPO: '<新しいリポジトリ名>',  // ここを変更
       // ...
   };
   ```

4. **ドキュメントを更新**
   
   以下のファイルのURLを更新:
   - `README.md`
   - `DEPLOYMENT.md`
   - `QUICK_START_JA.md`
   - `HOW_TO_MERGE_PR_JA.md`

   変更例:
   ```markdown
   # 変更前
   https://ishitatsu0117.github.io/PC-Calculator/
   
   # 変更後
   https://ishitatsu0117.github.io/<新しいリポジトリ名>/
   ```

5. **GitHub Pagesを再設定**
   - Settings → Pages で設定を確認
   - 必要に応じて再デプロイ

## URL変更後の確認事項

### 1. GitHub Actionsの確認
- [Actionsタブ](https://github.com/ISHITATSU0117/PC-Calculator/actions)でデプロイが成功していることを確認
- 緑のチェックマーク ✅ が表示されることを確認

### 2. 動作確認
- 新しいURLでアプリケーションにアクセス
- 各ページ（管理、結果、アップロード、ファイル管理）が正常に動作することを確認
- ブラウザのキャッシュをクリア（`Ctrl+Shift+R` / `Cmd+Shift+R`）

### 3. リンクの確認
すべてのページ間リンクが正しく動作することを確認:
- index.html から各ページへのリンク
- 各ページから index.html へのリンク

## トラブルシューティング

### カスタムドメインが機能しない

**DNS設定の確認:**
```bash
# DNSの確認（Linuxの場合）
dig www.example.com

# Windows の場合
nslookup www.example.com
```

DNS設定が反映されるまで24〜48時間かかる場合があります。

### GitHub Pagesが404エラーを返す

1. Settings → Pages で設定を確認
2. リポジトリがPublicであることを確認
3. mainブランチにファイルがコミットされていることを確認
4. GitHub Actionsのログを確認

### 古いURLにリダイレクトしたい

カスタムドメインを使用する場合、GitHub Pagesは自動的に古いURLから新しいURLにリダイレクトします。

リポジトリ名を変更した場合は、古いURLは404エラーになります。ユーザーに新しいURLを周知する必要があります。

## 参考リンク

- [GitHub Pages ドキュメント](https://docs.github.com/ja/pages)
- [カスタムドメインの設定](https://docs.github.com/ja/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [DNS設定のガイド](https://docs.github.com/ja/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

## 注意事項

⚠️ **重要**: URL変更後は、以下を忘れずに更新してください:
- すべてのドキュメント内のURL
- 外部サイトで共有しているURL
- ブックマークやショートカット
- QRコードなど印刷物のURL

---

**質問や問題がある場合は、GitHubのIssueで報告してください。**
