# Incidents API

概要
- インシデントの作成・更新・検索に関する API 設計と実装指針。

目的
- 一貫した DTO とバリデーションで堅牢な API を提供する。

主要トピック
- データモデルと DTO（`src/incidents/`）。
- コントローラ/サービス分離、エラーハンドリング、入力検証。
- OpenAPI 契約（`specs/001-fms-core/contracts/openapi.yaml`）との整合性。

チェックリスト
- [ ] DTO によるバリデーションがある
- [ ] Controller は薄く、ビジネスロジックは Service にある
- [ ] OpenAPI と実装が一致する

関連ファイル
- src/incidents/
- specs/001-fms-core/contracts/openapi.yaml

例: 新規インシデント作成
```http
POST /incidents
Content-Type: application/json
{
  "type": "fire",
  "location": {"lat": ..., "lon": ...}
}
```
