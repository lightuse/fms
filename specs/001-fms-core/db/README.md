# DB Migrations — FMS Core

This folder contains SQL-first migrations for the FMS core feature.

Preconditions
- Docker Compose (recommended): `devops/docker-compose.yml` brings up Postgres+PostGIS, Redis, Keycloak.

Quickstart (local)

1. Start dependencies:

```bash
docker compose -f devops/docker-compose.yml up -d db
```

2. Wait for Postgres to be ready, then run migrations:

```bash
./scripts/run-migrations.sh "postgresql://postgres:postgres@localhost:5432/fms"
```

3. Run RLS smoke tests:

```bash
./specs/001-fms-core/db/run_rls_tests.sh
```

Notes
- The migration runner applies `*.sql` in lexical order. Add new migration files with increasing prefixes (e.g. `0006_...sql`).
- `0005_enforce_status_enum.sql` was added to align DB enums with spec-defined state lists.
# DB マイグレーション & 実行手順

このフォルダには FMS コア用の SQL マイグレーション（順序付き）が含まれます。順に適用すると、PostGIS を有効化し、コアテーブルを作成し、Row-Level Security（RLS）を設定します。

重要: 本リポジトリの SQL は idempotent（多くは IF NOT EXISTS を使用）ですが、プロダクション環境では必ずバックアップを取得し、ダウン/ロールバック手順を用意した上で適用してください。

ファイル（適用順）:
- `0001_enable_postgis_and_extensions.sql` - PostGIS/拡張を有効化
- `0002_create_core_tables.sql` - tenants, users, stations, units, incidents, dispatch_events, gps_pings
- `0003_rls_policies_and_helpers.sql` - セッションヘルパー関数 + RLS ポリシー + 管理ロール

前提条件
- psql クライアント（または同等の接続手段）
- データベース接続情報（ホスト、DB名、ユーザー、パスワード）
- ホスティング環境によっては PostGIS 等の拡張を管理者側で有効化する必要があります（マネージドDBではスーパーユーザ権限が制限される場合があります）。

ローカル（psql）での適用例
1) 環境変数を設定しておく:

```bash
export PSQL_CONN="postgresql://postgres:password@localhost:5432/fms"
```

2) ファイルを順に適用:

```bash
psql "$PSQL_CONN" -f specs/001-fms-core/db/0001_enable_postgis_and_extensions.sql
psql "$PSQL_CONN" -f specs/001-fms-core/db/0002_create_core_tables.sql
psql "$PSQL_CONN" -f specs/001-fms-core/db/0003_rls_policies_and_helpers.sql
```

汎用スクリプト例（並べ替え済みのファイル名に依存）:

```bash
PSQL_CONN="postgresql://postgres:password@localhost:5432/fms"
for f in $(ls specs/001-fms-core/db/*.sql | sort); do
  echo "Applying $f"
  psql "$PSQL_CONN" -f "$f" || { echo "Failed: $f"; exit 1; }
done
```

Docker Compose 内の Postgres コンテナで実行する例

```bash
# コンテナ名が `db` の場合
docker-compose exec db bash -c "psql -U postgres -d fms -f /workspace/specs/001-fms-core/db/0001_enable_postgis_and_extensions.sql"
docker-compose exec db bash -c "psql -U postgres -d fms -f /workspace/specs/001-fms-core/db/0002_create_core_tables.sql"
docker-compose exec db bash -c "psql -U postgres -d fms -f /workspace/specs/001-fms-core/db/0003_rls_policies_and_helpers.sql"
```

注意点（RLS）
- 本実装はセッション変数 `fms.current_tenant` を使ってテナント分離を行います。アプリケーションは各トランザクション開始時に以下を実行してください：

  - `SELECT fms_set_current_tenant('<tenant-uuid>');`
  - あるいはトランザクション内で `SET LOCAL fms.current_tenant = '<uuid>';`

- テスト/検証:

```sql
-- テナント設定
SELECT fms_set_current_tenant('00000000-0000-0000-0000-000000000000');
-- 挿入（tenant_id は上の UUID と一致させる）
INSERT INTO tenants (id, name) VALUES ('00000000-0000-0000-0000-000000000000', 'test');
-- users テーブルの挙動を確認
SELECT * FROM users; -- RLS によってカプセル化された結果になるはず
```

ホスティング（マネージドDB）の注意点
- 一部のマネージド Postgres（例: RDS / CloudSQL）では拡張の有効化に制限があります。管理者コンソールやサポート窓口で PostGIS 等を有効にする必要がある場合があります。

CI / 本番での安全な適用
- ファイル順での適用を CI pipeline に組み込み、`psql` の実行前にスナップショット/バックアップを取得すること。
- 本リポジトリの SQL を直接適用する代わりに、Flyway / sqitch / node-pg-migrate 等のマイグレーションツールを使って up/down を管理することを推奨します。

ロールバックと変更管理
- 現在の SQL は主に idempotent に作成していますが、ロールバック（down）スクリプトは含んでいません。プロダクション導入前にマイグレーションツールで down を定義してください。

次の推奨作業
- `specs/001-fms-core/db/0004_seed_sample_data.sql`（開発用シード）を作成して、RLS テストを自動化する
- CI にマイグレーション実行ジョブを追加し、`0001..000N` が順に適用されるようにする

問題があれば教えてください — CI 向けの具体的な pipeline 定義（GitHub Actions など）を作成します。

ファイル作成日: 2026-02-09
