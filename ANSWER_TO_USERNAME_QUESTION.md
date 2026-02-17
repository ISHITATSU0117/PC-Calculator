# GITHUB ユーザー名を変更しても正常に動作しますか？

## 回答: はい、自動的に対応します！ ✅

PC-Calculatorアプリケーションは、GitHubユーザー名の変更に**自動的に対応**します。

## 🎯 主なポイント

### 自動検出機能

アプリケーションは、GitHub PagesのURL（`https://username.github.io/PC-Calculator/`）から自動的にユーザー名を検出します。

**ユーザー名変更後の動作:**
1. GitHubでユーザー名を変更
2. 新しいURL（`https://newusername.github.io/PC-Calculator/`）にアクセス
3. **アプリケーションが自動的に新しいユーザー名を使用** 🎉
4. 追加の設定は不要！

### 対応パターン

| 状況 | 対応方法 | 難易度 |
|------|---------|--------|
| GitHub Pages標準URL使用 | 完全自動（何もしなくてOK） | ⭐ 簡単 |
| カスタムドメイン使用 | config.jsを1行更新 | ⭐⭐ 普通 |

## 📚 詳細ガイド

完全な手順とトラブルシューティングについては、以下のドキュメントを参照してください：

**[GITHUB_USERNAME_CHANGE.md](GITHUB_USERNAME_CHANGE.md)** - 完全ガイド
- 自動検出の仕組み
- ユーザー名変更時の詳細手順
- カスタムドメイン使用時の対応
- トラブルシューティング
- 設定の確認方法

## 🔧 技術的な詳細

**実装方法:**
- GitHub Pages URL（`username.github.io`）からユーザー名を正規表現で抽出
- 検出失敗時はデフォルト値にフォールバック
- ローカルストレージでカスタム設定も可能

**優先順位:**
1. ローカルストレージの設定（カスタム設定がある場合）
2. URLから自動検出
3. デフォルト値

## ⚡ クイックスタート

### GitHub Pages使用時（最も一般的）

```bash
# 何もする必要はありません！
# 新しいURLにアクセスするだけでOK
```

### カスタムドメイン使用時

```javascript
// config.js の1行を更新
DEFAULT_GITHUB_OWNER: 'newusername',  // 新しいユーザー名
```

## 🎓 確認方法

ブラウザのコンソール（F12）で実行：
```javascript
ConfigManager.getDetectionInfo()
```

現在使用されているユーザー名が確認できます。

---

**結論**: GitHubユーザー名を変更しても、PC-Calculatorは問題なく動作します！GitHub Pages標準URLを使用している場合は完全自動、カスタムドメインの場合も簡単な設定変更のみで対応可能です。
