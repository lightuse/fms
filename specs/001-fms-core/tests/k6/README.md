# k6 シナリオ

このディレクトリには k6 による簡易負荷・統合シナリオが含まれます。

- `dispatch_ws_test.js`: WebSocket 接続（Socket.IO ではなく生 WS）を使った受信検証スモーク

注意: テナントは JWT の `tenant_id` クレームで伝播します。k6 シナリオを実行する際は Authorization ヘッダに有効な Bearer トークンを渡してください（テスト用のダミートークン/Keycloak を用意してください）。

環境変数:
- `K6_BASE_URL` (デフォルト: `http://localhost:3000/api`) — OpenAPI の servers.base に合わせて API のベースを指定してください
- `K6_AUTH` (必須): `Bearer <JWT>` 形式の Authorization ヘッダ値

実行例:

```bash
# 例: ローカル Keycloak でテスト用トークンを発行してから
K6_BASE_URL="http://localhost:3000/api" K6_AUTH="Bearer <token>" k6 run specs/001-fms-core/tests/k6/dispatch_ws_test.js
```
