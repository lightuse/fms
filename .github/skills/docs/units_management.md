# Units management

概要
- 車両やチームのデータモデル、ステータス管理、GPS ピング処理に関する運用指針。

目的
- ユニット情報の同期性と可観測性を維持する。

主要トピック
- ユニットモデル（位置、ステータス、最終ピン日時）。
- GPS ピングの受け取りと保存、サンプルレートとデータ保持ポリシー。
- 状態遷移（利用可能/出動中/保守）とイベント化。

チェックリスト
- [ ] GPS テーブルとインデックスがある
- [ ] ステータス遷移が明確に定義されている
- [ ] 長期間の履歴データ取り扱い方針がある

関連ファイル
- db/migrations/0004_add_gps_pings.sql
- src/units/

例: 最新位置を取得
```sql
SELECT * FROM unit_locations WHERE unit_id = ? ORDER BY recorded_at DESC LIMIT 1;
```
