# Integration testing

概要
- 統合テストの環境準備、テスト DB 初期化、CI 上での実行方法。

目的
- アプリケーションレイヤを通した動作確認とテナント分離などの検証。

主要トピック
- テスト用 DB のセットアップ（`scripts/setup_test_db.sh`）。
- テストデータのシードとロールバック戦略。
- CI での並列テスト実行時のデータ競合回避。

チェックリスト
- [ ] テスト用 DB を自動で作成/破棄するスクリプトがある
- [ ] テストケースは独立して実行できる
- [ ] 重要な統合フロー（dispatch 流れ等）をカバーしている

関連ファイル
- tests/integration/
- scripts/setup_test_db.sh

実行例（ローカル）
```bash
# テスト DB セットアップ
scripts/setup_test_db.sh
# テスト実行
npm test -- tests/integration
```
