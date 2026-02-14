# Tenant RLS (Row-Level Security)

概要
- テナント分離のための RLS ポリシー設計と実装、ミドルウェアでのテナント識別。

目的
- データレベルでテナント間の隔離を保証し、アプリケーションバグによる漏洩を防ぐ。

主要トピック
- RLS ポリシーの書き方と `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`。
- テナント識別ミドルウェア (`src/middleware/tenant.middleware.ts`) とクレデンシャルの伝播。
- テストケース：異なるテナントのデータ取得が分離されること。

チェックリスト
- [ ] RLS が必要なテーブルにポリシーがある
- [ ] ミドルウェアがリクエストから tenant_id を注入している
- [ ] 統合テストでテナント分離を検証している

関連ファイル
- db/migrations/0003_enable_rls_tenants.sql
- src/middleware/tenant.middleware.ts

テスト例（概念）
- テナント A のユーザーがテナント B のレコードを取得できないことを確認する。
