# 統合火災管理システム (FMS) - アーキテクチャ設計書

## システム概要

統合火災管理システム(Fire Management System: FMS)は、消防サービス全体をデジタル化し、緊急通報から事後分析までを一元管理する包括的なプラットフォームです。

---

## 全体アーキテクチャ図

```mermaid
graph TB
    subgraph Users["👥 ユーザー層"]
        U1[消防指揮官]
        U2[消防隊員]
        U3[通信指令員]
        U4[査察員]
        U5[一般市民]
    end

    subgraph Presentation["🖥️ プレゼンテーション層"]
        WEB[Webアプリ<br/>React.js/Next.js]
        MOBILE[モバイルアプリ<br/>Flutter/React Native]
        DESKTOP[デスクトップ<br/>PWA]
    end

    subgraph Security["🔐 APIゲートウェイ & セキュリティ層"]
        AUTH[認証・認可<br/>Keycloak SSO]
        ENCRYPT[暗号化通信<br/>TLS 1.3 / AES-256]
        GATEWAY[APIゲートウェイ<br/>負荷分散・ルーティング]
        AUDIT[監査ログ]
    end

    subgraph Application["⚙️ アプリケーション層 - コアモジュール"]
        M1[🚨 緊急通報・出動管理]
        M2[🗺️ 現場指揮管理]
        M3[🚒 資産・車両管理]
        M4[👥 人員・安全管理]
        M5[🔥 火災予防・査察]
        M6[📊 分析・インテリジェンス]
    end

    subgraph Logic["🧮 ビジネスロジック層"]
        WF[ワークフローエンジン<br/>Camunda/Temporal]
        NOTIF[通知・アラート<br/>Message Queue]
        RULES[ルールエンジン<br/>Business Rules]
    end

    subgraph Data["🗄️ データ層"]
        DB[(PostgreSQL<br/>+ PostGIS)]
        CACHE[(Redis<br/>キャッシュ)]
        STORAGE[ファイルストレージ<br/>S3/MinIO]
        DW[(Data Warehouse<br/>分析DB)]
    end

    subgraph Integration["🔌 統合・連携層"]
        GIS[GISシステム]
        IOT[IoTセンサー]
        POLICE[警察システム]
        EMS[医療サービス]
        WEATHER[気象情報]
    end

    subgraph Infrastructure["☁️ インフラストラクチャ層"]
        CLOUD[クラウド基盤<br/>99.99% SLA]
        K8S[Kubernetes<br/>コンテナ管理]
        MONITOR[監視・ログ<br/>アラート管理]
    end

    Users --> Presentation
    Presentation --> Security
    Security --> Application
    Application --> Logic
    Logic --> Data
    Application <--> Integration
    Data --> Infrastructure
    Logic --> Infrastructure
```

---

## 詳細モジュール構成図

```mermaid
graph LR
    subgraph Core["コアモジュール（必須）"]
        DISPATCH[緊急通報・出動管理<br/>━━━━━━━━<br/>• 112/911統合<br/>• GPS位置特定<br/>• 自動出動指示<br/>• リアルタイム追跡]
        INCIDENT[現場指揮管理<br/>━━━━━━━━<br/>• GIS地図可視化<br/>• 部隊配置管理<br/>• 消火栓マッピング<br/>• 複数機関連携]
    end

    subgraph Optional["オプションモジュール（選択可能）"]
        ASSET[資産・車両管理<br/>━━━━━━━━<br/>• 車両追跡<br/>• 在庫管理<br/>• メンテナンス<br/>• 燃料監視]
        
        PERSONNEL[人員・安全管理<br/>━━━━━━━━<br/>• シフト管理<br/>• 資格追跡<br/>• 健康モニタリング<br/>• 現場所在確認]
        
        PREVENTION[火災予防・査察<br/>━━━━━━━━<br/>• 査察スケジュール<br/>• デジタルチェック<br/>• 違反追跡<br/>• 教育記録管理]
        
        ANALYTICS[分析・AI予測<br/>━━━━━━━━<br/>• KPIダッシュボード<br/>• ヒートマップ<br/>• 傾向分析<br/>• AI予測モデル]
    end

    DISPATCH --> INCIDENT
    INCIDENT --> ASSET
    INCIDENT --> PERSONNEL
    INCIDENT --> PREVENTION
    INCIDENT --> ANALYTICS
```

---

## データフロー図

```mermaid
sequenceDiagram
    participant Citizen as 市民
    participant Call as 緊急通報センター
    participant FMS as FMS システム
    participant Dispatcher as 通信指令員
    participant Unit as 消防隊
    participant GIS as GISシステム
    participant IoT as IoTセンサー

    Citizen->>Call: 緊急通報 (112/911)
    Call->>FMS: 通報データ送信
    FMS->>GIS: GPS位置特定
    GIS-->>FMS: 座標・住所情報
    FMS->>FMS: 最寄り部隊検索
    FMS->>Dispatcher: 推奨出動案表示
    Dispatcher->>FMS: 出動指示確定
    FMS->>Unit: リアルタイム通知
    Unit->>FMS: 出動確認
    FMS->>GIS: ルート計算
    GIS-->>Unit: 最適経路表示
    Unit->>FMS: 現場到着報告
    IoT->>FMS: センサーデータ収集
    FMS->>Dispatcher: リアルタイム状況更新
    Unit->>FMS: 鎮火報告
    FMS->>FMS: インシデントクローズ
    FMS->>DW: 分析用データ保存

    Note over FMS,DW: 事後分析・レポート生成
```

---

## 技術スタック詳細

### フロントエンド層

| カテゴリ | 技術 | 用途 |
|---------|------|------|
| **Webアプリ** | React.js / Next.js | 指令センターダッシュボード、管理コンソール |
| **モバイルアプリ** | Flutter / React Native | 現場隊員用アプリ、査察チェックリスト |
| **地図表示** | Leaflet / OpenStreetMap | GISマッピング、ルート表示 |
| **UI コンポーネント** | Tailwind CSS / Material UI | レスポンシブデザイン |

### バックエンド層

| カテゴリ | 技術 | 用途 |
|---------|------|------|
| **アプリケーションサーバー** | Node.js (NestJS) / Java (Spring Boot) | ミッションクリティカルなビジネスロジック |
| **ワークフローエンジン** | Camunda / Temporal | 複雑な出動フロー自動化 |
| **API層** | RESTful API / GraphQL | クライアントとの通信 |
| **リアルタイム通信** | WebSocket / Server-Sent Events | 即座のデータ更新 |

### データ層

| カテゴリ | 技術 | 用途 |
|---------|------|------|
| **メインデータベース** | PostgreSQL + PostGIS | 構造化データ、地理空間情報 |
| **キャッシュ** | Redis | リアルタイム追跡、セッション管理 |
| **ファイルストレージ** | S3 / MinIO | 写真、動画、文書管理 |
| **分析DB** | Data Warehouse (Snowflake/BigQuery) | BI・レポーティング |

### 統合・連携

| カテゴリ | 技術 | 用途 |
|---------|------|------|
| **GISシステム** | ArcGIS API / OpenStreetMap | 地理情報統合 |
| **IoT通信** | MQTT / LoRaWAN | センサーデータ収集 |
| **メッセージング** | RabbitMQ / Apache Kafka | 非同期処理、イベント駆動 |
| **API管理** | Kong / Apigee | APIゲートウェイ、レート制限 |

### セキュリティ

| カテゴリ | 技術 | 用途 |
|---------|------|------|
| **認証・認可** | Keycloak (SSO) / OAuth 2.0 | シングルサインオン |
| **暗号化** | TLS 1.3 / AES-256 | 通信・データ暗号化 |
| **監査ログ** | ELK Stack (Elasticsearch) | 全操作記録・追跡 |
| **脆弱性診断** | OWASP ZAP / Snyk | セキュリティテスト |

### インフラストラクチャ

| カテゴリ | 技術 | 用途 |
|---------|------|------|
| **コンテナ** | Docker / Kubernetes | マイクロサービス管理 |
| **CI/CD** | GitLab CI / Jenkins | 自動デプロイメント |
| **監視** | Prometheus / Grafana | パフォーマンス監視 |
| **ログ管理** | Fluentd / Loki | ログ集約・分析 |

---

## システム配置図

```mermaid
graph TB
    subgraph Internet["インターネット"]
        USERS[エンドユーザー]
        MOBILE_USERS[モバイルユーザー]
    end

    subgraph DMZ["DMZ（非武装地帯）"]
        LB[ロードバランサー<br/>nginx/HAProxy]
        WAF[Webアプリケーション<br/>ファイアウォール]
        API_GW[APIゲートウェイ]
    end

    subgraph AppZone["アプリケーションゾーン"]
        WEB_SERVERS[Webサーバー群<br/>Kubernetes Pods]
        APP_SERVERS[アプリケーションサーバー群<br/>Microservices]
        WORKER[バックグラウンドワーカー<br/>Queue Processors]
    end

    subgraph DataZone["データゾーン"]
        DB_PRIMARY[(プライマリDB<br/>PostgreSQL)]
        DB_REPLICA[(レプリカDB<br/>Read Replica)]
        CACHE_CLUSTER[Redisクラスター<br/>HA構成]
        STORAGE_CLUSTER[オブジェクトストレージ<br/>S3/MinIO]
    end

    subgraph IntegrationZone["統合ゾーン"]
        ESB[エンタープライズ<br/>サービスバス]
        GIS_SERVER[GISサーバー]
        IOT_GATEWAY[IoTゲートウェイ]
    end

    subgraph External["外部システム"]
        EMERGENCY[緊急通報センター<br/>112/911]
        POLICE[警察システム]
        HOSPITAL[医療機関]
        WEATHER_API[気象情報API]
    end

    USERS --> LB
    MOBILE_USERS --> LB
    LB --> WAF
    WAF --> API_GW
    API_GW --> WEB_SERVERS
    API_GW --> APP_SERVERS
    APP_SERVERS --> DB_PRIMARY
    APP_SERVERS --> DB_REPLICA
    APP_SERVERS --> CACHE_CLUSTER
    APP_SERVERS --> STORAGE_CLUSTER
    APP_SERVERS --> WORKER
    APP_SERVERS <--> ESB
    ESB <--> GIS_SERVER
    ESB <--> IOT_GATEWAY
    ESB <--> EMERGENCY
    ESB <--> POLICE
    ESB <--> HOSPITAL
    ESB <--> WEATHER_API
    
    DB_PRIMARY -.レプリケーション.-> DB_REPLICA
```

---

## 高可用性(HA)構成図

```mermaid
graph TB
    subgraph Region1["リージョン 1（プライマリ）"]
        subgraph AZ1["可用性ゾーン A"]
            LB1[ロードバランサー]
            APP1[アプリサーバー群]
            DB1[(DB マスター)]
        end
        
        subgraph AZ2["可用性ゾーン B"]
            LB2[ロードバランサー]
            APP2[アプリサーバー群]
            DB2[(DB スタンバイ)]
        end
    end

    subgraph Region2["リージョン 2（DR）"]
        subgraph AZ3["可用性ゾーン C"]
            LB3[ロードバランサー]
            APP3[アプリサーバー群]
            DB3[(DB レプリカ)]
        end
    end

    USERS[ユーザー] --> DNS[DNSフェイルオーバー]
    DNS --> LB1
    DNS -.障害時.-> LB3
    
    LB1 --> APP1
    LB1 --> APP2
    APP1 --> DB1
    APP2 --> DB1
    
    DB1 -.同期レプリケーション.-> DB2
    DB1 -.非同期レプリケーション.-> DB3
    
    LB3 --> APP3
    APP3 --> DB3

    style DB1 fill:#4ade80
    style DB2 fill:#fbbf24
    style DB3 fill:#60a5fa
```

---

## セキュリティアーキテクチャ

```mermaid
graph TB
    subgraph Public["パブリックインターネット"]
        ATTACKER[潜在的脅威]
    end

    subgraph SecurityLayers["多層防御"]
        direction TB
        DDos[DDoS保護<br/>Cloudflare/AWS Shield]
        FW[ファイアウォール<br/>ステートフル検査]
        WAF2[WAF<br/>SQLi/XSS防止]
        IDS[侵入検知システム<br/>IDS/IPS]
    end

    subgraph AppSecurity["アプリケーションセキュリティ"]
        AUTH2[認証<br/>多要素認証 MFA]
        AUTHZ[認可<br/>RBAC/ABAC]
        ENCRYPT2[暗号化<br/>保存時・転送時]
        AUDIT2[監査ログ<br/>改ざん防止]
    end

    subgraph DataSecurity["データセキュリティ"]
        ENCRYPT_DB[DB暗号化<br/>透過的暗号化]
        MASK[データマスキング<br/>個人情報保護]
        BACKUP[暗号化バックアップ<br/>オフサイト保管]
    end

    subgraph Compliance["コンプライアンス"]
        GDPR[GDPR準拠<br/>個人データ保護]
        ISO[ISO 27001<br/>情報セキュリティ]
        SOC[SOC 2準拠<br/>監査証跡]
    end

    ATTACKER --> DDos
    DDos --> FW
    FW --> WAF2
    WAF2 --> IDS
    IDS --> AUTH2
    AUTH2 --> AUTHZ
    AUTHZ --> ENCRYPT2
    ENCRYPT2 --> AUDIT2
    AUDIT2 --> ENCRYPT_DB
    ENCRYPT_DB --> MASK
    MASK --> BACKUP
    BACKUP --> GDPR
    GDPR --> ISO
    ISO --> SOC
```

---

## マイクロサービスアーキテクチャ

```mermaid
graph TB
    subgraph Gateway["APIゲートウェイ層"]
        KONG[Kong Gateway<br/>ルーティング・認証・レート制限]
    end

    subgraph Services["マイクロサービス"]
        SVC1[緊急通報サービス<br/>Node.js]
        SVC2[出動管理サービス<br/>Java]
        SVC3[資産管理サービス<br/>Node.js]
        SVC4[人員管理サービス<br/>Node.js]
        SVC5[査察サービス<br/>Python]
        SVC6[分析サービス<br/>Python]
        SVC7[通知サービス<br/>Node.js]
        SVC8[GISサービス<br/>Python]
    end

    subgraph MessageBus["メッセージバス"]
        KAFKA[Apache Kafka<br/>イベントストリーミング]
    end

    subgraph SharedServices["共有サービス"]
        AUTH_SVC[認証サービス<br/>Keycloak]
        LOG_SVC[ログ集約<br/>ELK Stack]
        CONFIG_SVC[設定管理<br/>Consul]
    end

    KONG --> SVC1
    KONG --> SVC2
    KONG --> SVC3
    KONG --> SVC4
    KONG --> SVC5
    KONG --> SVC6
    
    SVC1 --> KAFKA
    SVC2 --> KAFKA
    SVC3 --> KAFKA
    SVC4 --> KAFKA
    
    KAFKA --> SVC7
    KAFKA --> SVC8
    
    SVC1 -.認証.-> AUTH_SVC
    SVC2 -.認証.-> AUTH_SVC
    SVC3 -.ログ.-> LOG_SVC
    SVC4 -.設定.-> CONFIG_SVC
```

---

## 主要機能フロー

### 1. 緊急通報から出動まで

```mermaid
flowchart TD
    A[緊急通報受信] --> B{位置情報取得成功?}
    B -->|はい| C[GPS座標特定]
    B -->|いいえ| D[手動住所入力]
    C --> E[GISシステム照会]
    D --> E
    E --> F[最寄り消防署検索]
    F --> G[利用可能車両確認]
    G --> H{車両あり?}
    H -->|はい| I[自動出動推奨]
    H -->|いいえ| J[近隣署へエスカレーション]
    I --> K[指令員承認]
    K --> L[出動指示送信]
    L --> M[隊員モバイルへ通知]
    M --> N[車両出動]
    N --> O[リアルタイム追跡開始]
    J --> K
```

### 2. 現場活動フロー

```mermaid
flowchart TD
    A[現場到着] --> B[到着報告送信]
    B --> C[インシデントタイマー開始]
    C --> D[現場評価]
    D --> E{追加応援必要?}
    E -->|はい| F[応援要請]
    E -->|いいえ| G[消火活動開始]
    F --> G
    G --> H[活動状況更新]
    H --> I{鎮火確認?}
    I -->|いいえ| H
    I -->|はい| J[鎮火報告]
    J --> K[現場写真撮影]
    K --> L[デジタル報告書作成]
    L --> M[署へ帰還]
    M --> N[車両・機材点検]
    N --> O[インシデントクローズ]
```

---

## モジュール間依存関係

```mermaid
graph LR
    CORE[コアシステム<br/>認証・DB・API] 
    
    CORE --> DISPATCH[緊急通報・出動]
    CORE --> INCIDENT[現場指揮]
    CORE --> ASSET[資産管理]
    CORE --> PERSONNEL[人員管理]
    CORE --> PREVENTION[火災予防]
    CORE --> ANALYTICS[分析・AI]
    
    DISPATCH --> INCIDENT
    INCIDENT --> ASSET
    INCIDENT --> PERSONNEL
    INCIDENT --> ANALYTICS
    PREVENTION --> ANALYTICS
    PERSONNEL --> ANALYTICS
    ASSET --> ANALYTICS
    
    style CORE fill:#ef4444,color:#fff
    style DISPATCH fill:#3b82f6,color:#fff
    style INCIDENT fill:#3b82f6,color:#fff
    style ASSET fill:#10b981,color:#fff
    style PERSONNEL fill:#10b981,color:#fff
    style PREVENTION fill:#10b981,color:#fff
    style ANALYTICS fill:#f59e0b,color:#fff
```

---

## 導入フェーズ計画

```mermaid
gantt
    title FMS 導入スケジュール（6フェーズ）
    dateFormat YYYY-MM
    section フェーズ1
    要件定義・プロセス分析    :p1, 2025-03, 2M
    section フェーズ2
    コア開発・統合           :p2, after p1, 3M
    section フェーズ3
    モバイルアプリ開発       :p3, after p2, 2M
    section フェーズ4
    セキュリティ強化・試験    :p4, after p3, 2M
    section フェーズ5
    パイロット運用・研修      :p5, after p4, 2M
    section フェーズ6
    本格展開・AI予測追加     :p6, after p5, 3M
```

---

## システムの主要特徴

### ✅ モジュール式設計
- 必要な機能のみを選択して購入可能
- 段階的な導入でリスクとコストを最小化
- 将来的な機能拡張が容易

### ✅ ホワイトラベル対応
- 各消防機関のブランディングに完全対応
- 独自ドメイン（例: fms.tokyo-fire.jp）での運用
- ロゴ、配色、組織名のカスタマイズ

### ✅ マルチテナント
- 単一インフラで複数組織を安全に分離
- 組織間のデータ完全隔離
- 運用コストの削減

### ✅ API優先設計
- すべての機能がAPI経由でアクセス可能
- 警察、医療など他機関システムとの連携が容易
- IoTセンサー・デバイス統合

### ✅ オフライン機能
- 災害時の通信途絶でも基本機能が継続
- モバイルアプリでのローカルデータ保存
- 接続回復時の自動同期

### ✅ 高可用性
- 99.99% SLA（年間53分以下のダウンタイム）
- マルチリージョン展開による災害対策
- 自動フェイルオーバー機能

---

## 期待される効果

| 効果領域 | 具体的な改善 |
|---------|------------|
| **応答時間短縮** | 自動出動推奨により平均30%削減 |
| **人命救助** | 迅速な対応により救命率向上 |
| **運用コスト** | 資源最適化により20-30%削減 |
| **隊員安全** | リアルタイム位置追跡で安全性向上 |
| **データ駆動** | 証拠に基づく政策立案・予算配分 |
| **市民信頼** | 透明性の高い記録管理で信頼性向上 |

---

## まとめ

統合火災管理システム(FMS)は、消防サービスのデジタルトランスフォーメーションを実現する戦略的基盤です。モジュール式のアーキテクチャにより、小規模な消防署から国家レベルまで、あらゆる規模の組織に対応可能な柔軟性を持ちます。

セキュリティ・バイ・デザインの原則に基づき、高可用性とスケーラビリティを兼ね備えた本システムは、アフリカをはじめとする新興市場における**公共安全のフラッグシップソリューション**となることが期待されます。
