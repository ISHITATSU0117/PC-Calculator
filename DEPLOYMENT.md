# デプロイメントガイド / Deployment Guide

## 📌 変更がwebページに反映されない理由

このアプリケーションはGitHub Pagesでホストされており、**mainブランチへのプッシュ時にのみ自動デプロイされます**。

### なぜ変更が反映されないのか？

1. **プルリクエスト（PR）はまだマージされていません**
   - PRの変更はmainブランチにマージされるまで、公開サイトには反映されません
   - PRブランチの変更は公開サイトには表示されません
   - 公開サイト: mainブランチの内容のみ

2. **GitHub Actionsワークフローの確認**
   - `.github/workflows/deploy.yml` がmainブランチへのプッシュを監視
   - PRブランチの変更は自動デプロイされません

## ✅ 変更を反映させる手順

### 1. プルリクエストをマージする

```bash
# GitHubのウェブインターフェースで:
# 1. PRページに移動
# 2. "Merge pull request" ボタンをクリック
# 3. "Confirm merge" をクリック
```

### 2. デプロイメントの完了を待つ

マージ後、GitHub Actionsが自動的にデプロイを開始します：

1. **Actionsタブで確認**
   - https://github.com/ISHITATSU0117/PC-Calculator/actions
   - "Deploy to GitHub Pages" ワークフローを確認

2. **デプロイ時間**
   - 通常 1〜3分で完了します
   - ✅ 緑のチェックマークが表示されたら完了

3. **デプロイURL**
   - https://ishitatsu0117.github.io/PC-Calculator/

### 3. ブラウザのキャッシュをクリアする

デプロイ完了後も古いページが表示される場合：

#### Windowsの場合:
- **Chrome / Edge**: `Ctrl + Shift + R` または `Ctrl + F5`
- **Firefox**: `Ctrl + Shift + R`

#### Macの場合:
- **Chrome / Edge / Safari**: `Cmd + Shift + R`
- **Firefox**: `Cmd + Shift + R`

#### 完全なキャッシュクリア:
1. ブラウザの設定を開く
2. "履歴" または "プライバシー" セクション
3. "閲覧履歴データを消去"
4. "キャッシュされた画像とファイル" を選択
5. "データを消去" をクリック

## 🔍 トラブルシューティング

### Q1: マージしたのに変更が反映されない

**確認事項:**
1. GitHub Actionsが正常に完了したか確認
   - Actionsタブで最新のワークフローをチェック
   - エラーが表示されていないか確認

2. 正しいURLにアクセスしているか
   - 正: `https://ishitatsu0117.github.io/PC-Calculator/`
   - 誤: ローカルファイルパス（`file:///...`）

3. ブラウザキャッシュをクリアしたか
   - 強制リロード: `Ctrl + Shift + R` (Win) / `Cmd + Shift + R` (Mac)

### Q2: GitHub Actionsでエラーが発生している

**対処方法:**
1. Actionsタブで失敗したワークフローをクリック
2. ログを確認してエラーメッセージを読む
3. 一般的なエラー:
   - **権限エラー**: Settings → Pages → Source が "GitHub Actions" になっているか確認
   - **ファイルエラー**: 必要なファイル（index.html等）が存在するか確認

### Q3: 変更を確認する前にテストしたい

**ローカルでテストする方法:**

```bash
# リポジトリをクローン
git clone https://github.com/ISHITATSU0117/PC-Calculator.git
cd PC-Calculator

# PRブランチをチェックアウト（ブランチ名は適宜変更してください）
git checkout <your-pr-branch-name>

# ローカルサーバーを起動
# Pythonを使用する場合:
python -m http.server 8000

# Node.jsを使用する場合:
npx http-server -p 8000
```

ブラウザで `http://localhost:8000` にアクセスして確認できます。

### Q4: PRをマージせずに変更を公開したい

**一時的な方法（非推奨）:**

直接mainブランチにプッシュすることもできますが、コードレビューのプロセスを経ないため推奨されません。

**推奨される方法:**
1. PRをレビュー
2. 問題がなければマージ
3. 自動デプロイを待つ

## 📊 デプロイメントフロー

```
コード変更
    ↓
PRブランチにコミット・プッシュ
    ↓
PRをレビュー
    ↓
mainブランチにマージ ← ここで自動デプロイ開始
    ↓
GitHub Actions実行 (1〜3分)
    ↓
GitHub Pagesに公開
    ↓
ブラウザで確認 (キャッシュクリアが必要な場合あり)
```

## 🔧 GitHub Pages設定の確認

Settings → Pages で以下を確認:

- **Source**: GitHub Actions
- **Custom domain**: (設定している場合のみ)
- **Enforce HTTPS**: ✅ 推奨

正しく設定されている場合、以下のメッセージが表示されます:
```
Your site is live at https://ishitatsu0117.github.io/PC-Calculator/
```

## 📝 補足情報

### デプロイが必要なケース:
- HTMLファイルの変更 (index.html, results.html等)
- JavaScriptファイルの変更 (config.js, api.js, calculator.js)
- CSSスタイルの変更
- 新しいファイルの追加

### デプロイが不要なケース:
- READMEの更新（サイトには表示されないため）
- GitHubリポジトリ設定の変更
- Issue/PRのコメント

---

**重要**: 
このアプリケーションでは、CSVデータは別リポジトリ（設定で指定したリポジトリ）に保存されます。
CSVファイルをアップロードした場合、アプリコードのデプロイは不要です（データは即座に反映されます）。
