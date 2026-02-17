# URLを変更したいのですが、可能ですか？

## 回答: はい、可能です！ 🎉

PC-CalculatorアプリケーションのURLは変更可能です。2つの方法があります：

### 方法1: カスタムドメインを使用する
独自ドメイン（例: `www.yoursite.com`）を使用できます。
- GitHub Pagesはカスタムドメインをサポートしています
- DNS設定が必要です
- 詳細は [URL_CONFIGURATION.md](URL_CONFIGURATION.md) の「方法1」を参照

### 方法2: リポジトリ名を変更する
リポジトリ名を変更すると、URLも自動的に変わります。
- 例: `PC-Calculator` → `NewName` に変更
- URL: `https://ishitatsu0117.github.io/NewName/` になります
- 詳細は [URL_CONFIGURATION.md](URL_CONFIGURATION.md) の「方法2」を参照

## 📚 完全ガイド

URL変更の詳細な手順については、以下のドキュメントを参照してください：

1. **[URL_CONFIGURATION.md](URL_CONFIGURATION.md)** - 完全なURL変更ガイド
   - カスタムドメインの設定方法（DNS設定含む）
   - リポジトリ名変更の手順
   - 一括変更コマンド（Linux/macOS/Windows対応）
   - トラブルシューティング

2. **[.url-references](.url-references)** - 技術者向け参照ドキュメント
   - 更新が必要なファイルと行番号の完全リスト
   - 一括置換コマンド例
   - 検証コマンド

## ⚠️ 重要な注意事項

- アプリケーション自体（HTML/JSファイル）は既に相対リンクを使用しているため、コード変更は不要です
- ドキュメントファイル（README.md等）に記載されているURLのみ更新が必要です
- 提供されている一括変更コマンドを使用すると簡単に更新できます

## 🚀 次のステップ

1. [URL_CONFIGURATION.md](URL_CONFIGURATION.md) を読む
2. カスタムドメインまたはリポジトリ名変更のどちらかを選択
3. ガイドに従って設定を行う
4. 提供されているコマンドでドキュメントを一括更新

---

このドキュメントは質問への回答として作成されました。URL変更を実施する際は、上記のガイドを参照してください。
