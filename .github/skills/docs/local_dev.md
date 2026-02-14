# Local dev / Docker / WSL

概要
- 開発者がローカルで素早く作業できる環境のセットアップ手順。

目的
- 一貫した開発環境を提供し、環境差異による不具合を減らす。

主要トピック
- WSL の利用と Docker コンテナでの実行。
- よく使うコマンド（起動、マイグレーション、テスト）。

チェックリスト
- [ ] WSL 上での Node / Docker 環境が整っている
- [ ] 起動手順が README に記載されている
- [ ] ログとデバッグ方法が明示されている

関連ファイル
- README.md
- scripts/

よく使うコマンド
```bash
# 開発サーバ起動
npm run dev
# マイグレーション適用
scripts/run-migrations.sh
```
