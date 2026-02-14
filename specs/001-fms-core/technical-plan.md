# Technical Plan — FMS Core


## 概要

- 目的: 統合火災管理システム（FMS）コアワークフローの技術的実装方針を示す。MVP 範囲は「通報→指令→出動→現着→鎮火」。

- スコープ: Backend API、Realtime 配信、Frontend/司令UI、Mobile stub、PostGIS データ、RLS を用いたマルチテナント。

## 主要決定事項

- Backend: NestJS (TypeScript)

- Frontend: Next.js (React)

<<<<<<< HEAD
- Mobile: Flutter (軽量スタブ実装で開始)
=======
- Mobile: React Native (軽量スタブ実装で開始)
>>>>>>> origin/001-create-frontend

- DB: PostgreSQL 15+ with PostGIS

- マルチテナント: Single schema + Row-Level Security (RLS)

- テナント伝播: JWT クレーム `tenant_id` をアプリで検証し、トランザクション開始時に `fms_set_current_tenant()` または `SET LOCAL fms.current_tenant` を設定

- Realtime: Socket.IO + Redis Pub/Sub

- マイグレーション: SQL-first（`specs/001-fms-core/db/*.sql`）を初期運用、将来的に node-pg-migrate に移行

アーキテクチャ（概要）
- API 層: NestJS が REST/WS エンドポイントを提供。認証は Keycloak（OIDC）、各リクエストで JWT 検証を行いテナントを決定。
- DB 層: PostGIS 拡張を有効化した PostgreSQL。RLS ポリシーでテナント分離、空間インデックス（GIST）で近傍検索を高速化。
- リアルタイム: 指令イベントは Socket.IO 経由で配信。複数インスタンス環境では Redis Pub/Sub をブリッジに使用。
<<<<<<< HEAD
- Mobile: Flutter スタブは Socket.IO または FCM 経由で通知を受け取り、GPS を定期送信。
=======
- Mobile: React Native スタブは Socket.IO または FCM 経由で通知を受け取り、GPS を定期送信。
>>>>>>> origin/001-create-frontend

データモデル（ハイライト）
- Tenant: id (uuid), name, settings
- User: id, display_name, role, tenant_id
- Station: id, name, location (geography POINT)
- Unit: id, unit_type, status (enum), location (geography), station_id, tenant_id
- Incident: id, tenant_id, reporter_id, location (nullable), location_text, type, severity, timeline
- DispatchEvent: id, incident_id, unit_id, issued_by, issued_at, status_changes
- GPSPing: id, unit_id, timestamp, location, accuracy

RLS / マルチテナント運用
- アプリは JWT を検証後、必ず DB セッションにテナントを設定する（例を `spec.md` に記述済み）。
- `0003_rls_policies_and_helpers.sql` にある `fms_set_current_tenant()` とポリシーを使用。
- CI での RLS 検証は毎回 DB を初期化してからマイグレーションとテストを実行する（`.github/workflows/db-migrations.yml` に初期化を追加済）。

マイグレーション戦略
- 初期: SQL ファイルを PR レビューで管理（可読性重視）。ファイルは `specs/001-fms-core/db/` に保管。
- 中期: node-pg-migrate を導入して up/down を管理する（移行計画を `tasks.md` に追加）。
- 運用: 本番はブルー/グリーンやロールフォワード手順に従い、`pg_dump` で論理バックアップを取得しておく。

CI / テスト戦略
- ユニット: Vitest（backend）、各サービスのロジックを低レイヤでテスト。
- 統合: CI が PostGIS を起動し、SQL マイグレーションを適用、`run_rls_tests.sh` などで RLS と基本クエリを検証。
- 負荷: k6 シナリオ（`specs/001-fms-core/tests/k6/`）で指令遅延や位置更新遅延を計測。
- E2E: Playwright（将来的）で UI → API → DB の end-to-end。

デプロイ／ローカル開発
- Docker Compose を開発用に用意（Postgres+PostGIS, Redis, Keycloak, backend）。`devops/docker-compose.yml` を用意予定。
- Local: `specs/001-fms-core/db/README.md` に SQL 適用手順を記載。

監視・運用
- 指標: 指令配信成功率、通知遅延（p50/p95）、DB エラー率、RLS ポリシー違反アラート
- ロギング: structured JSON logs（request id, tenant_id, incident_id）を収集
- アラート: 指令失敗率や Redis 接続異常を監視し、SLO を超えたらページング

リスクと軽減
- R1: テナント伝播の不整合 → ミドルウェアで JWT 検証を必須化、RLS テストを CI に組込
- R2: Socket.IO と k6 のプロトコル差異 → Socket.IO 用の専用負荷ツール/スクリプトを作成（もしくは実クライアントで検証）
- R3: PostGIS インデックス不足で検索が遅い → マイグレーションで GIST インデックス作成を必須化、性能テストを CI に追加

マイルストーン（短期）
- W3: Map 基盤、PostGIS スキーマ、初期シード完了
- W4: Incident API + proximity search + basic UI
- W5: Dispatch ロジックと Socket.IO 配信、Redis テスト
- W6: Mobile stub + GPS ping + offline sync doc
- W7: E2E シナリオと動態表示
- W8: 統合テスト・デプロイ文書化

次のステップ
1. 本ドキュメントをレビューして承認（PR ベース）
2. `tasks_sprint_breakdown.md` を Issue に変換して担当者を割り当てる（`scripts/create_issues_from_tasks.sh --dry-run` で確認）
3. node-pg-migrate 導入計画（T006）を実行してマイグレーションの一本化を行う
