# Spatial / PostGIS

概要
- PostGIS の有効化、空間データ型、ジオメトリ操作、空間インデックスと空間クエリの基礎。

目的
- 空間検索（近傍検索、範囲検索）を正確かつ高速に実装する。

主要トピック
- PostGIS のインストールと有効化（`db/migrations/0001_enable_postgis.sql`）。
- ジオメトリ型（`POINT`, `LINESTRING`, `POLYGON`）と SRID の扱い。
- 空間インデックス（GiST）の作成とパフォーマンス留意点。
- 空間クエリ：`ST_DWithin`, `ST_Intersects`, `ST_Distance`。

チェックリスト
- [ ] マイグレーションで PostGIS を有効化済み
- [ ] 主要テーブルにジオメトリカラムと GiST インデックスがある
- [ ] SRID が統一されている（例: 4326）

関連ファイル
- db/migrations/0001_enable_postgis.sql
- src/db.ts

よく使うコマンド
```sql
-- 例: 近傍検索
SELECT * FROM units WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint(lon, lat), 4326), 1000);
```
