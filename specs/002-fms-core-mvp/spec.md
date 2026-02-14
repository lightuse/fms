# Feature Specification: 統合火災管理システム (FMS) — Core MVP

**Feature Branch**: `002-fms-core-mvp`  
**Created**: 2026-02-11  
**Status**: Draft  
**Input**: User description: "統合火災管理システム (FMS) コアMVP — 通報→指令→出動ワークフロー：司令室Web、現場モバイル、PostGIS、WebSocket、マルチテナントDB"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Dispatcher: 受信→指令→ユニット割当 (Priority: P1)

指令員（Dispatcher）は通報を受け、地図上で発生地点を確認し、利用可能なユニットを選択して指令を発行できる。

**Why this priority**: 中核ワークフローであり MVP の価値を直接提供するため最優先。

**Independent Test**: 新しいインシデントを作成し、3台のユニットのうち空きのあるユニットが候補に上がり、指令後にインシデントが「Dispatched」状態になる。

**Acceptance Scenarios**:

1. **Given** テナントに複数ユニットが登録され、少なくとも1台が利用可能、 **When** 指令員が通報を作成して「指令」を発行、 **Then** 選択したユニットがそのインシデントに紐付き、ステータスは「Dispatched」になる。
2. **Given** 指令を発行した後、同件の指令が該当ユニットのモバイルにリアルタイム通知として到達する。

---

### User Story 2 - Firefighter (現場): 指令受信・ステータス更新 (Priority: P2)

隊員（Firefighter）はモバイルアプリで指令を受信し、出動→現着→完了までステータスを更新し、定期的にGPS位置を送信する。

**Why this priority**: 現場との双方向通信がないと運用が成立しないため高優先。

**Independent Test**: モバイルクライアントに指令通知が到達し、隊員が「出動」を押すとインシデントの隊員ステータスが更新される。

**Acceptance Scenarios**:

1. **Given** 指令が割り当てられたユニットのモバイル、 **When** 隊員が「出動(En Route)」を押す、 **Then** インシデントの該当ユニットステータスが更新され、司令室に反映される。

---

### User Story 3 - 司令室マップ: 動態表示と検索 (Priority: P3)

司令室の地図上でインシデント、署、ユニット位置をリアルタイム表示し、指定半径内で利用可能なユニットを検索できる。

**Why this priority**: インシデント対応の意思決定を支援するために必要だが、指令と現場同期の後に続行可能。

**Independent Test**: インシデント座標を指定して「半径 N km の候補を検索」し、期待されるユニットが候補リストに含まれる。

**Acceptance Scenarios**:

1. **Given** マップ上に複数ユニットが表示され、 **When** 指令員が地点を選択して半径検索を実行、 **Then** 条件に合うユニット一覧が返される。

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- オフライン／再接続: モバイルがオフライン時はローカルに操作を保持し、再接続時に差分を同期すること。
- ユニット競合: 同じユニットに複数の指令が同時発生した場合、最初のコミットを優先し、他はエラーとして扱うか待機キューへ移す（トランザクションによる排他）。
- テナント分離: テナント A のユーザーがテナント B のデータへアクセスできないこと（RLS/schema による検証を想定）。
- ジオコーディング失敗: 住所から座標が得られない場合は手動ピン配置を促す。

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST allow a Dispatcher to create an `Incident` with location (coordinate or manual pin), type, and priority.
- **FR-002**: System MUST list candidate `Unit`s within a configurable radius of an incident, filtered by availability and unit capabilities.
- **FR-003**: System MUST allow a Dispatcher to assign one or more Units to an Incident as a single atomic operation.
- **FR-004**: System MUST deliver a real-time notification to the assigned Unit(s) and update their assignment status.
- **FR-005**: System MUST allow a Unit (mobile) to update status (En Route, On Scene, Contained/Completed) and send periodic GPS pings.
- **FR-006**: System MUST persist audit logs for all dispatch actions and status transitions with timestamps and actor IDs.
- **FR-007**: System MUST enforce tenant data separation so users/units from one tenant cannot access or influence another tenant's data.
- **FR-008**: System MUST provide an API for map queries (nearby-units, incident list) that supports spatial filters.
- **FR-009**: System MUST surface transient errors (e.g., assignment conflict) as clear, testable error responses.

*Notes*: Authentication/authorization, storage technology, and notification channels are considered implementation details and are out of scope for acceptance tests; tests will assert observable behavior (authorized actor can perform action; notification delivered to intended recipient).

### Key Entities

- **Tenant**: 管轄単位（自治体等）。属性: `tenant_id`, name, configuration.
- **User**: Dispatcher / Admin / Firefighter。属性: `user_id`, role, tenant_id.
- **Unit**: 車両または隊。属性: `unit_id`, capabilities, status (Available/Assigned/InTransit/etc.), tenant_id, last_known_location.
- **Incident**: 通報イベント。属性: `incident_id`, location (lat/lon), type, priority, status, assigned_units, tenant_id, timestamps.
- **DispatchEvent**: 指令操作の記録。属性: `event_id`, incident_id`, actor_id, action, timestamp.
- **GPSPing**: 位置更新。属性: `ping_id`, unit_id, lat, lon, timestamp.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Success Criteria

- **SC-001**: Dispatcher が新規インシデント作成→ユニット割当を行う主要フローを手動で実行した場合、操作完了までに 3 分以内で完了できる（観察可能なユーザ操作時間）。
- **SC-002**: 指令発行後のユニット状態反映がリアルタイム表示で 95% のケースで 5 秒以内に反映される（觀測条件を定義して測定）。
- **SC-003**: 半径検索（N=5km）で候補ユニットが正しく返される精度が 99%（テスト用フィクスチャ下）。
- **SC-004**: マルチテナント分離テストでテナント間データ漏洩が 0 件であること（自動化テストによる検証）。
- **SC-005**: 主要ワークフロー（通報→指令→出動）における E2E 成功率が 95% 以上（CI の統合テストで確認）。

