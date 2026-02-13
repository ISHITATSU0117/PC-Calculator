# クイックスタートガイド（日本語）

## ❓ 変更がwebページに反映されない場合

### 簡単な答え：

**PRをmainブランチにマージしてください。マージ後、1〜3分で自動的にデプロイされます。**

### 手順：

1. **GitHubでPRをマージ** ⬅️ これが最も重要！
   - PRページを開く
   - 「Merge pull request」をクリック
   - 「Confirm merge」をクリック

2. **デプロイ完了を待つ（1〜3分）**
   - [Actionsタブ](https://github.com/ISHITATSU0117/PC-Calculator/actions)で確認
   - 緑のチェックマーク ✅ が表示されたら完了

3. **ブラウザでページを開く**
   - https://ishitatsu0117.github.io/PC-Calculator/
   
4. **キャッシュをクリア**（古いページが表示される場合）
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

---

## 💡 重要なポイント

### GitHub Pagesの仕組み：

```
PRブランチの変更 ❌ → webページには反映されない
     ↓
mainブランチにマージ ✅
     ↓
自動デプロイ（1〜3分）
     ↓
webページに反映される 🎉
```

### なぜPRの変更は反映されないのか？

- GitHub Pagesは**mainブランチのみ**をデプロイします
- PRブランチは「準備中」の状態で、まだ公開されていません
- マージすることで初めて公開サイトに反映されます

---

## 🔍 トラブルシューティング

### ケース1: マージしたのに反映されない

**確認:**
- [ ] [Actionsタブ](https://github.com/ISHITATSU0117/PC-Calculator/actions)で緑のチェックマーク ✅
- [ ] ブラウザのキャッシュをクリア（`Ctrl + Shift + R`）
- [ ] 正しいURL（https://ishitatsu0117.github.io/PC-Calculator/）

### ケース2: GitHub Actionsがエラー

**対処:**
1. [Actionsタブ](https://github.com/ISHITATSU0117/PC-Calculator/actions)でエラーログを確認
2. Settings → Pages → Source が「GitHub Actions」になっているか確認

### ケース3: マージする前にテストしたい

**ローカルでテスト:**
```bash
# リポジトリをクローン
git clone https://github.com/ISHITATSU0117/PC-Calculator.git
cd PC-Calculator

# PRブランチに切り替え（ブランチ名は適宜変更してください）
git checkout <your-pr-branch-name>

# ローカルサーバー起動
python -m http.server 8000
# または
npx http-server -p 8000
```

ブラウザで http://localhost:8000 を開く

---

## 📚 詳細情報

より詳しい情報は以下を参照してください：

- **デプロイメント詳細**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **アプリの使い方**: [README.md](README.md)
- **GitHub Actions**: [.github/workflows/deploy.yml](.github/workflows/deploy.yml)

---

## ✨ よくある質問

**Q: 毎回マージしないとダメですか？**
A: はい。mainブランチにマージしないと公開サイトには反映されません。

**Q: マージせずに変更を公開できますか？**
A: できません。これは安全性のための仕様です（レビューなしでの公開を防ぐため）。

**Q: CSVデータの変更もデプロイが必要ですか？**
A: いいえ。CSVデータは別リポジトリに保存されるため、アップロード後すぐに反映されます。

**Q: デプロイに失敗した場合は？**
A: [Actionsタブ](https://github.com/ISHITATSU0117/PC-Calculator/actions)でエラーログを確認し、[DEPLOYMENT.md](DEPLOYMENT.md)のトラブルシューティングを参照してください。

---

**作成日**: 2026年2月  
**最終更新**: 2026年2月
