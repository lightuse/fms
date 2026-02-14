# 技術スタック（概要）

短くまとめた現在のプロジェクト技術スタックです。

- **言語:** TypeScript（バックエンド・フロントエンド共通）
- **ランタイム / パッケージ管理:** Node.js / npm（`package.json` スクリプト）
 - **ランタイム / パッケージ管理:** Node.js / npm（`package.json` スクリプト）
 - **パッケージマネージャ（推奨）:** pnpm（コンテナ化イメージで使用するよう更新済み）

- **バックエンド:**
  - フレームワーク: NestJS (^10)
  - ORM: TypeORM (0.3.x)
  - DB ドライバ: `pg`
  - マイグレーション: `node-pg-migrate`
  - 実行/開発: `ts-node-dev`, `typescript`
  - 認証: JWT (`jsonwebtoken`) を利用するミドルウェア
  - 参照: [backend/package.json](backend/package.json), [backend/src/app.module.ts](backend/src/app.module.ts)

- **フロントエンド（Dispatcher）:**
  - フレームワーク: React 19
  - ビルド/開発: Vite
  - マップ: Leaflet
  - リアルタイム: `socket.io-client`
  - 参照: [frontend/dispatcher/package.json](frontend/dispatcher/package.json), [frontend/dispatcher/vite.config.ts](frontend/dispatcher/vite.config.ts), [frontend/dispatcher/src/App.tsx](frontend/dispatcher/src/App.tsx)

- **リアルタイム通信:** Socket.IO（サーバ: `socket.io`, クライアント: `socket.io-client`）

- **データベース / ジオ空間:**
  - DB: PostgreSQL
  - 空間拡張: PostGIS（マイグレーションで拡張を有効化）
  - ジオ型: `geometry(Point,4326)` などを使用
  - マイグレーション例: [backend/db/migrations/0001_enable_postgis.sql](backend/db/migrations/0001_enable_postgis.sql)

- **テスト:**
  - ユニット/軽量テスト: Vitest（バックエンドに設定）
  - 統合テスト: `tests/integration/` にある仕様テスト

- **その他ツール / スクリプト:**
  - `node-pg-migrate`（DB マイグレーション）
  - `scripts/setup_test_db.sh`（テスト用 DB 作成）
  - `scripts/mock-socket-server.js`（モックのソケットサーバ）

- **リポジトリ内の主な参照ファイル:**
  - [backend/README.md](backend/README.md)
  - [backend/package.json](backend/package.json)
  - [frontend/dispatcher/package.json](frontend/dispatcher/package.json)
  - [backend/db/migrations](backend/db/migrations)

---
次の提案:
- バージョンを厳密化する（`engines` や `package.json` の pinning）
- CI/CD / Docker 化の明示（必要なら `Dockerfile` や `docker-compose` の追加）
- ドキュメントにデプロイ手順とローカル起動手順を追加

---
コンテナ化 (Docker)

- 本リポジトリには簡易的なコンテナ定義を追加しました。
  - `backend/Dockerfile` — NestJS アプリを TypeScript でビルドし `dist/main.js` を実行します。
  - `frontend/dispatcher/Dockerfile` — Vite でビルドし `nginx` で静的配信します。
  - `docker-compose.yml` — PostGIS を含む DB、バックエンド、フロントエンドを一括起動します。

クイックスタート:

```bash
docker compose up --build
```

バックグラウンドで起動する場合:

```bash
docker compose up --build -d
```

注意事項:
- デフォルトの DB 接続文字列は `postgres://postgres:postgres@db:5432/fms` です。必要に応じて `docker-compose.yml` の環境変数を調整してください。
- `JWT_SECRET` は `docker-compose.yml` に仮の値を入れています。本番では安全な値に変更してください。

