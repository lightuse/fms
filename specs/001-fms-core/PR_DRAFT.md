# PR Draft: Feature 001-fms-core — FMS Core (初期マイルストーン)

目的
- MVP（US1: 通報→指令→出動→現着→鎮火）の実装を開始するための初期インフラ、DB マイグレーション、契約整合の変更を取り込む。

含まれる変更（概要）
- `specs/001-fms-core/contracts/openapi.yaml` : JWT ベアラー認証の追加、tenant_id の伝播に関する注記、servers.base を `http://localhost:3000/api` に変更。
- `specs/001-fms-core/db/0005_enforce_status_enum.sql` : `units.status` / `incidents.status` を enum 化して仕様の状態一覧と整合させるマイグレーションを追加。
- `specs/001-fms-core/tests/k6/dispatch_load_test.js` : OpenAPI に合わせて k6 経路を調整（BASE および /v1/... パス）。
- `devops/docker-compose.yml` : Postgres+PostGIS / Redis / Keycloak / backend placeholder のローカル compose を追加。
- `scripts/run-migrations.sh` : `specs/001-fms-core/db/*.sql` を順に適用する簡易ランナーを追加。
- `specs/001-fms-core/db/README.md` : マイグレーション手順ドキュメントを追加。

理由 / 背景
- OpenAPI とテスト（k6）で経路の不一致が見つかり、その整合をとるために契約側とテスト側を揃えました。
- ステータス値はスペックで定義済のため、DB 側にも制約を置いて意図しない値の流入を防ぎます。

CI 検証手順（この PR の必須チェック）
1. 起動: `docker compose -f devops/docker-compose.yml up -d db redis keycloak`
2. DB 初期化: CI ジョブは作業用 DB を DROP/CREATE してクリーンにする（既存 workflow に初期化ステップを挿入済みであることを確認）
3. マイグレーション適用: `./scripts/run-migrations.sh "$PG_CONN"` を実行（`0001..0005` が順に適用されること）
4. RLS smoke tests: `./specs/001-fms-core/db/run_rls_tests.sh` を実行し失敗が無いこと
5. OpenAPI contract check: `spectral lint specs/001-fms-core/contracts/openapi.yaml`（または equivalent）でエラーがないこと
6. Backend unit/integration tests (Vitest) がパスすること（認可ミドルウェアは JWT を使った最小スモークで組み込む）
7. k6 smoke: 軽量シナリオを 10 VUs で実行し主要エンドポイントが応答すること（失敗率 < 1%）

Merge 条件（必須）
- CI のステップ 3-6 がすべてパス
- `specs/001-fms-core/tasks_master.md` を基に Issue/チケット化が計画されていること（PR description に Issue へのリンクを含める）
- セキュリティチェック: OpenAPI に securitySchemes が含まれ、JWT を使った smoke test が追加されていること

備考 / 次の作業
- W3 の compose 起動・マイグレーション適用がローカルで確認済みなら、次に US1 の API 実装（Incident モデル/コントローラ）へ着手します。
- この PR をマージ後、`scripts/create_issues_from_tasks.sh` の dry-run を使って Issue 作成を行うか、Milestone を先に作成してから実行することを推奨します。
