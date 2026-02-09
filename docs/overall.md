# 統合火災管理システム (FMS) 8週間開発計画書

## 1. プロジェクト概要
**目標:** 緊急通報から車両の出動、現場到着、鎮火報告までの一連の「コアワークフロー」を完結させるMVPを構築する。
**期間:** 8週間
**対象:** フェーズ2 (Core Platform) および フェーズ3の一部 (Mobile Field App)

### 1.1 開発スコープ (MVP)
*   **In-Scope (実装対象):**
    *   **司令室 (Web):** ユーザー認証、GISマップ表示、通報入力、車両への指令送信、リアルタイム動態監視。
    *   **現場 (Mobile):** 出動要請の受信(Push通知)、ステータス変更(出動/現着/終了)、GPS位置情報の送信。
    *   **基盤:** マルチテナント対応DB、APIサーバー、WebSocket通信。
*   **Out-of-Scope (8週間後は対象外):**
    *   高度な在庫管理・購買フロー、人事評価・給与連携、予防査察の詳細ワークフロー、AIによる予測分析、IoTセンサー（ドローン等）との物理連携。

## 2. 推奨技術スタック (PDF Section 11準拠)
*   **Frontend (Web):** Next.js (React), OpenStreetMap (Leaflet/MapLibre)
*   **Mobile App:** Flutter (iOS/Android両対応)
*   **Backend:** Node.js (NestJS)
*   **Database:** PostgreSQL + PostGIS (地理空間データ), Redis (リアルタイム位置情報/キャッシュ)
*   **Infra/Security:** Docker, Keycloak (SSO/Identity Management)

---

## 3. 週間スケジュール (WBS)

### フェーズ 1: アーキテクチャ設計と基盤構築 (Week 1 - 2)
**目的:** セキュアでスケーラブルな「デジタル神経系」の土台を作る（PDF Section 9）。

| 週 | カテゴリ | タスク詳細 | 成果物 |
| :--- | :--- | :--- | :--- |
| **W1** | **要件・設計** | **DBスキーマ設計:** マルチテナント構造（Schema分離 or Row-level Security）、PostGIS用ジオメトリ型定義。<br>**API仕様策定:** Swagger/OpenAPIによるエンドポイント定義。<br>**UI/UX設計:** 指令台(Dispatcher)とモバイル(Firefighter)のFigmaプロトタイプ作成。 | ER図<br>API仕様書<br>画面ワイヤーフレーム |
| **W2** | **基盤実装** | **バックエンド構築:** NestJS環境セットアップ、Docker化。<br>**認証基盤:** Keycloakのセットアップ（管理者、指令員、隊員のロール定義）。<br>**初期データ投入:** テスト用の消防署、車両、人員データのシード作成。 | 認証付きAPIサーバー<br>Dev環境 |

### フェーズ 2: GIS統合と指令機能の開発 (Week 3 - 5)
**目的:** 112/911通報を受け、場所を特定し、最適な部隊を送り出す（PDF Section 4.1 & 4.2）。

| 週 | カテゴリ | タスク詳細 | 成果物 |
| :--- | :--- | :--- | :--- |
| **W3** | **GIS & マップ** | **Webマップ実装:** OpenStreetMapの表示、管轄エリアのポリゴン表示。<br>**ジオコーディング:** 住所入力から座標への変換、および地図上のピン配置機能。<br>**リソース可視化:** 消防署アイコンと車両の初期位置表示。 | マップ機能付きWeb UI |
| **W4** | **指令ロジック** | **インシデント管理:** 通報入力フォーム（火災種別、重要度）。<br>**空間検索:** PostGISを使用し、発生場所から半径N km以内の「利用可能(Available)」な車両をリストアップするロジック。<br>**指令発行:** 選択したユニットへのディスパッチ処理（DBトランザクション）。 | インシデント作成機能<br>車両推奨アルゴリズム |
| **W5** | **リアルタイム通信** | **WebSocket (Socket.io):** サーバー・クライアント間の双方向通信実装。<br>**ステータス同期:** 指令が出た瞬間に画面をリロードせずステータスが変わる仕組み。<br>**通知基盤:** FCM (Firebase Cloud Messaging) の統合準備。 | リアルタイム通信基盤 |

### フェーズ 3: モバイル連携と現場運用 (Week 6 - 7)
**目的:** 現場との情報の非対称性を解消し、隊員の安全を確保する（PDF Section 4.4）。

| 週 | カテゴリ | タスク詳細 | 成果物 |
| :--- | :--- | :--- | :--- |
| **W6** | **モバイルアプリ** | **Flutter実装:** ログイン画面、指令受信画面の実装。<br>**プッシュ通知:** 指令受信時のアラート吹鳴。<br>**ステータス更新:** 「出動(En Route)」「現着(On Scene)」「鎮火(Contained)」ボタンの実装とAPI連携。 | 隊員用アプリ (α版) |
| **W7** | **動態管理 (AVL)** | **GPS追跡:** モバイルアプリからの定期的な位置情報送信（バックグラウンド処理）。<br>**司令室反映:** 受信したGPSデータを司令室マップ上のアイコン位置にリアルタイム反映。<br>**オフライン対応:** 通信断絶時のデータローカル保存と再接続時送信の実装。 | 動態管理システム |

### フェーズ 4: 統合テストとデプロイ (Week 8)
**目的:** システムの安定性を検証し、納品可能な状態にする。

| 週 | カテゴリ | タスク詳細 | 成果物 |
| :--- | :--- | :--- | :--- |
| **W8** | **仕上げ** | **E2Eテスト:** 通報受信→指令→出動→完了のシナリオテスト。<br>**ホワイトラベル検証:** 設定ファイルによるロゴ・配色変更の確認（PDF Section 12.2）。<br>**デプロイ:** 本番環境へのリリース、初期管理者アカウントの発行。 | **FMS v1.0 リリース**<br>操作マニュアル |

---

## 4. システムアーキテクチャ概要

```mermaid
graph TD
    User[指令員 / Dispatcher] -->|HTTPS| Web[Web App (Next.js)]
    Mobile[隊員 / Firefighter] -->|HTTPS/WebSocket| API[API Gateway (NestJS)]
    
    subgraph "Backend Services"
        API --> Auth[Keycloak (Auth)]
        API --> DB[(PostgreSQL + PostGIS)]
        API --> Cache[(Redis / PubSub)]
        API --> Socket[WebSocket Server]
    end
    
    subgraph "External Integration"
        Web --> OSM[OpenStreetMap Tile Server]
        API --> FCM[Firebase (Push Notification)]
    end

    Socket -.->|Real-time Updates| Web
    Socket -.->|Incident Alerts| Mobile
    Mobile -.->|GPS Location| Socket
```

## 5. 重要な開発方針 (PDF要件への対応)

1.  **ホワイトラベル設計 (White-Label Design):**
    *   システムは「テナントID」を全てのAPIリクエストに含める設計とし、自治体ごとにデータを論理的に完全分離します。
    *   フロントエンドは環境変数または設定JSONで「ロゴ」「テーマカラー」を動的に切り替えます。

2.  **モジュール構成 (Modular Architecture):**
    *   NestJSのModule機能を活用し、`DispatchModule`, `AuthModule`, `ResourceModule` を分離。将来的に「在庫管理」や「人事」を追加する際、既存コードへの影響を最小限にします。

3.  **高可用性とオフライン対応 (Resilient Deployment):**
    *   モバイルアプリはSQLiteを内部に持ち、通信圏外でもステータス変更やレポート入力ができるように設計します（通信回復時に同期）。

## 6. リスク管理

*   **リスク:** 8週間でGIS（地図）の精度が出ない。
    *   **対策:** 初版ではGoogle Maps API等の有料APIは使用せず、OpenStreetMapを使用。住所検索精度が低い地域のために「手動ピン配置」機能を最優先で実装する。
*   **リスク:** リアルタイム通信の遅延。
    *   **対策:** 位置情報の更新頻度を「移動速度」に応じて可変（静止時は送信しないなど）にし、サーバー負荷を軽減する。