```markdown
# Implementation Plan: FMS Core (具体化)

Branch: `001-fms-core` | Date: 2026-02-09 | Spec: `specs/001-fms-core/spec.md`

Summary
-------
この計画は FMS のコアワークフロー（通報→指令→出動→現着→鎮火）を MVP として実装するための具体的実行計画です。技術スタックは以下を想定し、Phase/Task で示したタスクを順次実行します。

Technical Context (決定事項)
--------------------------------
- Backend: NestJS (TypeScript)

## Implementation Plan: FMS Core — 実装計画 (更新: 2026-02-10)

Branch: `feature/001-fms-core-infra` | Spec: `specs/001-fms-core/spec.md`

概要
----
このドキュメントは、FMS のコアワークフロー（通報→指令→出動→現着→鎮火）を MVP として短期間で安定的に実装し、CI・検証・リリースまでつなげるための段階的実装計画です。想定スタックは既存の仕様どおり：NestJS（バックエンド）、Next.js（フロント）、PostgreSQL+PostGIS、Keycloak（認証）、Socket.IO + Redis（リアルタイム）。

フェーズ概要（高レベル）
--------------------
- Phase 0 — Research & Prep (1 week)
	- 既知の未確定項目を解消（`spec.md` の NEEDS CLARIFICATION をレビュー）。
	- 開発用 docker-compose を整備・起動し、`specs/001-fms-core/db/*.sql` を CI と同じ手順で適用できることを確認。
	- `run_rls_tests.sh` を強化（既に実施済）して CI で非特権ユーザとして検証できることを確認。

- Phase 1 — Design & Contracts (1 week)
	- `data-model.md` を確定：エンティティ（incidents, units, users, dispatches, attachments）、フィールド、インデックス（GIST）を定義。
	- OpenAPI 契約を完成（`contracts/openapi.yaml`）：主要エンドポイント（/incidents, /dispatches, /units, /auth）、JWT ベアラ認可スキーム。
	- Acceptance Criteria（受け入れ条件）を各エンドポイントに紐付ける。

- Phase 2 — Migrations & DB infra (1 week)
	- SQL マイグレーションの安定化：0001..0005 をレビューし、必要であれば 0006 を追加（enum デフォルトの安全な移行など）。
	- CI ジョブでマイグレーションと `run_rls_tests.sh` が自動成功することを確認。

- Phase 3 — Backend Skeleton & Auth (2 weeks)
	- NestJS プロジェクト初期化、ルーティングと DI 構成を追加。
	- 認可ミドルウェア：Keycloak JWT 受け取り、`tenant_id` を検証して DB セッション（`SET fms.current_tenant`）を設定するミドルウェア実装。
	- Repository 層を作り、最初の CRUD（/incidents, /units）を実装（トランザクションと RLS を考慮）。
	- ユニットテスト / 統合テスト（Vitest）を追加。

- Phase 4 — Realtime & Dispatch Flow (2 weeks)
	- Socket.IO エンドポイント設計・実装（認証付き、Redis アダプタで水平スケール可能に）。
	- 出動指令ワークフロー実装：通報受信 → 最寄りユニット検索（PostGIS）、指令作成、ユニットへプッシュ通知 → ユニットの出動ステータス更新。
	- k6 の簡易負荷シナリオ作成（WS と HTTP を含む）と初期負荷テスト実施。

- Phase 5 — Frontend & E2E (2 weeks)
	- Next.js で最小限の UI（通報作成、指令受信、ユニット地図表示）を実装。
	- Playwright による E2E シナリオ作成（主要ユーザフロー）。

- Phase 6 — Stabilize, CI, Release (1 week)
	- CI の全ゲート（マイグレーション、RLS 検証、ユニット/統合/E2E、k6 smoke）を安定稼働させる。
	- ドキュメント（quickstart, runbook, rollback 手順）整備。

成果物（Deliverables）
---------------------
- `specs/001-fms-core/data-model.md` — 確定データモデル。
- `specs/001-fms-core/contracts/openapi.yaml` — 公開 API 契約（JWT 認証付き）。
- `specs/001-fms-core/db/*.sql` — マイグレーション一式（0001..NN）。
- `backend/` — NestJS 実装（認証ミドルウェア、主要エンドポイント、Repository 層、テスト）。
- `frontend/` — Next.js MVP UI（通報/指令/ユニット地図）。
- CI ワークフロー — マイグレーション検証、RLS テスト、ユニット/統合/E2E、k6 smoke を含む。

受け入れ基準（例）
-----------------
- 各テナントは別テナントのデータを参照できない（CI の `run_rls_tests.sh` が通る）。
- 通報作成から最寄りユニットに指令が届く一連のフローが E2E で成功する。
- OpenAPI に沿った HTTP API が存在し、主要エンドポイントに対するユニットテスト/統合テストがある。
- k6 の簡易シナリオでピーク接続数と指令遅延の大まかな挙動を確認できる。

CI / テストの詳細（ゲート）
--------------------------
- PR の CI は以下を必須ゲートとする:
	1. DB 環境起動（PostGIS）
	2. マイグレーション適用（`specs/.../db/*.sql`）
	3. RLS 検証（`run_rls_tests.sh`、非特権ユーザ実行）
	4. Backend ユニット/統合テスト (Vitest)
	5. Frontend E2E（オプション：nightly で実行）
	6. k6 smoke（オプション・PRに長時間負荷を掛けない）

リスクと緩和策
----------------
- RLS の誤設定 → CI で必須ゲートにして早期検出。`run_rls_tests.sh` を非特権で実行するように変更済。
- enum / スキーマの online マイグレーション難易度 → 重大な column デフォルト変更は段階的 migration を作成（既存データの安全な移行手順を明記）。
- 認証周り（Keycloak）でのミスマッチ → OpenID コネクタ、JWT クレーム検証をユニットテストで強化。

簡単なタイムライン（合計 8–9 週間、並行作業で短縮可能）
------------------------------------------------
- Week 0: Phase 0 (準備)
- Week 1: Phase 1 (設計・契約)
- Week 2: Phase 2 (DB 安定化)
- Week 3–4: Phase 3 (Backend core)
- Week 5–6: Phase 4 (Realtime/Dispatch)
- Week 7: Phase 5 (Frontend/E2E)
- Week 8: Phase 6 (Stabilize/Release)

「次の具体的アクション」推奨（優先順）
1. `data-model.md` を作成してレビューを得る（2 人で 1 日）
2. `contracts/openapi.yaml` を仕上げ、k6 テストを契約に合わせて更新
3. Backend の初期リポジトリと認証ミドルウェアを立ち上げる
4. CI ジョブに新しい `run_rls_tests.sh` を組み込み、PR で自動検証が通ることを確認

追加リソース
---------------
- `specs/001-fms-core/db/README.md` — DB 起動とマイグレーション手順
- `devops/docker-compose.yml` — ローカル開発用 compose（Postgres, Redis, Keycloak）

---

更新処理: このファイルは計画の出発点です。実装進捗に合わせて `data-model.md`、`contracts/`、`tasks.md` を更新していきます。
