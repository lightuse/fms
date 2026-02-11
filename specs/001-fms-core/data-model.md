# FMS Core — Data Model (草案)

このドキュメントは MVP 実装に必要な主要エンティティ、フィールド、リレーション、検証ルール、インデックスをまとめたものです。実装に先立ちレビューして確定してください。

## 概要
- マルチテナンシー: 単一スキーマ + Row-Level Security。セッション変数 `fms.current_tenant` を使ってスコープを制御。
- 地理空間: PostGIS を使用。位置は `geometry(Point, 4326)` を想定。距離計算は `geography` キャストで行う（ST_DWithin など）。

## Entities

1. tenants
   - id: uuid PRIMARY KEY
   - name: text NOT NULL
   - metadata: jsonb

2. users
   - id: uuid PRIMARY KEY
   - tenant_id: uuid NOT NULL -- CHECK または RLS で保護
   - email: text UNIQUE
   - name: text
   - role: text -- enum 例: 'operator','dispatcher','responder','admin'
   - created_at, updated_at: timestamptz
   - constraints: email は optional（外部認証主体のため）

3. incidents
   - id: uuid PRIMARY KEY
   - tenant_id: uuid NOT NULL
   - reporter_id: uuid NULL REFERENCES users(id)
   - external_reference: text NULL
   - location: geometry(Point,4326) NOT NULL
   - severity: text -- enum: 'low','medium','high'
   - status: text -- enum: 'Open','Dispatched','Enroute','OnScene','Resolved'
   - properties: REMOVED (not present in DB migration) -- note: Incident schema aligned to DB: use explicit fields `location_text`, `type`, `notes` instead. Remove `properties` usage from API and backend.
   - created_at, updated_at
   - indexes: GIST on location

4. units
   - id: uuid PRIMARY KEY
   - tenant_id: uuid NOT NULL
   - name: text
   - type: text -- enum: 'engine','ladder','ambulance','water_tanker',...
   - position: geometry(Point,4326) NULL
   - status: text -- enum: 'Available','Assigned','Enroute','OnScene','Contained','Offline'
   - capabilities: jsonb (equipment, capacity)
   - last_seen_at: timestamptz
   - indexes: GIST on position

5. dispatches
   - id: uuid PRIMARY KEY
   - tenant_id: uuid NOT NULL
   - incident_id: uuid NOT NULL REFERENCES incidents(id)
   - unit_id: uuid NOT NULL REFERENCES units(id)
   - issued_by: uuid NULL REFERENCES users(id)
   - issued_at: timestamptz
   - accepted_at: timestamptz NULL
   - arrived_at: timestamptz NULL
   - status: text -- enum: 'issued','accepted','acknowledged','arrived','cancelled'
   - metadata: jsonb

6. attachments (optional)
   - id: uuid PRIMARY KEY
   - tenant_id: uuid NOT NULL
   - incident_id: uuid NULL REFERENCES incidents(id)
   - uploaded_by: uuid NULL REFERENCES users(id)
   - storage_key: text NOT NULL
   - mime: text
   - created_at

## Relationships
- tenants 1:N users, units, incidents, dispatches, attachments
- incidents 1:N dispatches
- units 1:N dispatches

## Indexes & Performance
- GIST index on `incidents.location` and `units.position` for nearest-neighbor and ST_DWithin queries.
- B-tree indexes on `tenant_id`, `status`, `created_at` for common filters.

## Validation & Constraints
- Enforce enums via Postgres enum types or CHECK constraints; migrations must be careful when altering enums in-place.
- `tenant_id` must always be present for tenant-scoped tables; RLS policies will restrict visibility based on session variable.

## RLS Policies (summary)
- For each tenant-scoped table (users, incidents, units, dispatches, attachments):
  - Policy: allow SELECT/INSERT/UPDATE/DELETE only when `tenant_id = current_setting('fms.current_tenant')::uuid` OR role has `fms_admin` privilege.
  - Helpers: `fms_set_current_tenant(uuid)` and `fms_current_tenant()` are provided in `0003_rls_policies_and_helpers.sql`.

## Sample Queries (implementation hints)
- Find nearest available units to an incident (within radius):
  SELECT u.* FROM units u JOIN incidents i ON i.id = $1
  WHERE ST_DWithin(i.location::geography, u.position::geography, $radius)
  AND u.status = 'available'
  ORDER BY ST_Distance(i.location::geography, u.position::geography) LIMIT $n;

## Notes / Open questions
- Tenant metadata (billing, settings) schema TBD.
- Offline handling / caching for unit positions (high-frequency updates) — consider Timescale or write path with upsert throttling.

---

次: `contracts/openapi.yaml` をこのデータモデルに合わせて作成します。続けて OpenAPI を生成しましょうか？
# data-model.md — 001-fms-core

Generated: 2026-02-09

## Entities

### Tenant
- id: uuid (PK)
- name: string
- settings: jsonb (logo, theme, feature toggles)
- created_at, updated_at

### User
- id: uuid (PK)
- tenant_id: uuid (FK -> tenant.id)
- username: string
- display_name: string
- email: string
- roles: text[] (e.g., ['dispatcher','firefighter','admin'])
- created_at, updated_at

### Station
- id: uuid
- tenant_id: uuid
- name: string
- location: geometry(Point, 4326)
- address: text
- created_at, updated_at

### Unit (Vehicle)
- id: uuid
- tenant_id: uuid
- station_id: uuid
- unit_type: string
- status: enum('Available','Assigned','En Route','On Scene','Contained','Offline')
- position: geometry(Point, 4326)
- last_seen_at: timestamptz
- metadata: jsonb

### Incident
- id: uuid
- tenant_id: uuid
- creator_id: uuid (User)
- location: geometry(Point, 4326)
- location_text: text
- type: enum('fire','accident','medical','other')
- severity: enum('low','medium','high')
- notes: text
- status: enum('Open','Assigned','InProgress','Resolved','Closed')
- created_at, updated_at

### DispatchEvent
- id: uuid
- incident_id: uuid
- unit_id: uuid
- issued_by: uuid (User)
- issued_at: timestamptz
- response_status: enum('Pending','Accepted','Rejected','Arrived')
- response_at: timestamptz
- details: jsonb

### GPSPing
- id: uuid
- unit_id: uuid
- timestamp: timestamptz
- position: geometry(Point, 4326)
- accuracy_m: numeric

## Indexing & Performance notes
- PostGIS GIST index on geometry columns (position, location)
- Indexes on tenant_id for multi-tenant filtering
- Partial indexes for available units (status='Available')

## RLS policy overview (high level)
- All tables with tenant_id enforce RLS using tenant claim from JWT (app_user.context.tenant_id)
- Admin roles may bypass RLS via separate role membership

