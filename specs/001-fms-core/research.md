# research.md — 001-fms-core

Generated: 2026-02-09

## Decision: マルチテナント方式
- Decision: Single schema + Row-level Security (RLS)
- Rationale: 短期間のMVPで運用・監視・クエリ最適化が容易。テナント毎にスキーマを作る運用負荷を避ける。将来的に要件が厳格化すればスキーマ分離へ移行可能。
- Alternatives considered:
  - Schema per tenant — より強い隔離だが運用・マイグレーション負荷が高い。
  - Hybrid — 大規模テナント向けには有用だが初期の複雑性が高い。

## Unknowns and recommended choices (resolved)

1. Geocoding (住所→座標)
   - Decision: 初期は Nominatim (self-hosted or public) / 位置検索におけるフォールバックは手動ピン配置
   - Rationale: 無料で利用可能、OpenStreetMap準拠、MVPコストが低い。将来的に精度が必要なら有料APIに切替。
   - Alternatives: Google Geocoding API (有料、精度高い), Here, Mapbox

2. Push Notifications
   - Decision: Firebase Cloud Messaging (FCM) を主要候補（Android/iOS対応）。サーバ側は通知送信ロジックを抽象化して将来の切替を容易にする。
   - Rationale: 広く使われており統合が容易。iOSではAPNs経由のトークン管理が必要。
   - Alternatives: OneSignal, Amazon SNS

3. Real-time transport
   - Decision: WebSocket (Socket.IO on NestJS) for MVP; Redis Pub/Sub for server-side fanout across instances.
<<<<<<< HEAD
   - Rationale: Socket.IO has broad client support (web + flutter with socket_io_client), Redis provides cross-process pubsub.
=======
   - Rationale: Socket.IO has broad client support (web + React Native with socket_io_client), Redis provides cross-process pubsub.
>>>>>>> origin/001-create-frontend
   - Alternatives: MQTT, WebRTC (not needed)

4. Offline sync and conflict resolution
   - Decision: Mobile stores events locally (SQLite) and replays on reconnect. Conflict policy: last-writer-wins for status updates; dispatch assignments are source-of-truth server-side via transactional locking.
   - Rationale: Simpler to implement; ensures dispatch integrity on server.

5. Authentication / SSO
   - Decision: Keycloak for auth; integrate via OIDC for frontend and mobile. Server validates tokens and extracts tenant from user claims.
   - Rationale: Matches project stack; supports roles and realms.

6. Performance targets (initial)
   - Decision: Define soft targets for MVP: 100 concurrent active sessions, dispatch notification p95 < 5s; map position update p95 < 5s.
   - Rationale: Reasonable for pilot deployments; to be re-evaluated with load testing.

## Research tasks (remaining)
- Evaluate Nominatim rate limits and decide self-host vs public.
- Implement a prototype of Socket.IO + Redis pub/sub to validate latency under small load.
- Confirm FCM iOS token flow and APNs setup requirements.
- Define RLS policies and migration strategy if moving to schema-per-tenant later.

## Summary
Most critical architecture choices for MVP selected: RLS multitenancy, Nominatim (geocoding) fallback to manual pin, FCM for push, Socket.IO + Redis for realtime, Keycloak for auth. Remaining operational tasks prioritized for Phase 1 implementation and validation.
