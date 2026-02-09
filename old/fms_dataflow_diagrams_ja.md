# 統合火災管理システム (FMS) - データフロー図集

## 目次
1. [緊急通報から出動までの全体フロー](#1-緊急通報から出動までの全体フロー)
2. [現場活動データフロー](#2-現場活動データフロー)
3. [システム間データ連携フロー](#3-システム間データ連携フロー)
4. [リアルタイムデータフロー](#4-リアルタイムデータフロー)
5. [分析・レポーティングデータフロー](#5-分析レポーティングデータフロー)
6. [査察・予防データフロー](#6-査察予防データフロー)
7. [IoTセンサーデータフロー](#7-iotセンサーデータフロー)
8. [モバイルアプリデータ同期フロー](#8-モバイルアプリデータ同期フロー)

---

## 1. 緊急通報から出動までの全体フロー

```mermaid
sequenceDiagram
    participant Citizen as 市民
    participant CallCenter as 緊急通報センター<br/>(112/911)
    participant FMS as FMSシステム
    participant GIS as GISシステム
    participant Dispatcher as 通信指令員
    participant FireStation as 消防署システム
    participant Mobile as 隊員モバイルアプリ
    participant Vehicle as 消防車両

    Note over Citizen,Vehicle: フェーズ1: 通報受信・位置特定
    Citizen->>CallCenter: 緊急通報
    activate CallCenter
    CallCenter->>FMS: 通報データ送信<br/>{電話番号、発信地情報}
    activate FMS
    
    FMS->>GIS: GPS座標取得要求<br/>{電話番号、基地局情報}
    activate GIS
    GIS-->>FMS: 座標データ<br/>{緯度、経度、精度}
    deactivate GIS
    
    FMS->>GIS: 住所逆ジオコーディング
    activate GIS
    GIS-->>FMS: 住所情報<br/>{都道府県、市区町村、番地}
    deactivate GIS

    Note over FMS: データ検証・正規化

    FMS->>FMS: 管轄区域判定<br/>最寄り消防署検索

    Note over Citizen,Vehicle: フェーズ2: 利用可能リソース確認

    FMS->>FireStation: 車両・人員状態照会
    activate FireStation
    FireStation-->>FMS: リソース情報<br/>{車両ID、状態、人員、装備}
    deactivate FireStation

    FMS->>FMS: 出動推奨アルゴリズム実行<br/>- 距離計算<br/>- 車両適合性評価<br/>- 人員充足度確認

    Note over Citizen,Vehicle: フェーズ3: 指令員判断・承認

    FMS->>Dispatcher: 推奨出動案表示<br/>{推奨車両、予測到着時間、ルート}
    activate Dispatcher
    
    Dispatcher->>FMS: 出動指示確定<br/>{出動車両、隊長、隊員、装備}
    deactivate Dispatcher

    Note over Citizen,Vehicle: フェーズ4: 通知・出動

    FMS->>FireStation: 出動指令送信<br/>{インシデントID、出動車両、目的地}
    activate FireStation
    FireStation->>FireStation: 警報サイレン起動<br/>表示盤更新
    deactivate FireStation

    FMS->>Mobile: プッシュ通知<br/>{緊急出動、住所、詳細}
    activate Mobile
    Mobile->>Mobile: 通知音・バイブレーション<br/>画面表示
    
    Mobile->>FMS: 出動確認応答<br/>{隊員ID、確認時刻}
    deactivate Mobile

    FMS->>GIS: 最適ルート計算<br/>{出発地、目的地、リアルタイム交通情報}
    activate GIS
    GIS-->>Mobile: ナビゲーション情報<br/>{ターンバイターン、予測時間}
    deactivate GIS

    Note over Citizen,Vehicle: フェーズ5: 出動・追跡

    Mobile->>FMS: 車両出発報告<br/>{出発時刻、GPS位置}
    FMS->>FMS: インシデントタイムライン記録<br/>- 通報受信: XX:XX:XX<br/>- 出動指示: XX:XX:XX<br/>- 車両出発: XX:XX:XX

    loop リアルタイム追跡 (5秒間隔)
        Mobile->>FMS: GPS位置情報送信<br/>{緯度、経度、速度、方位}
        FMS->>Dispatcher: 地図上の車両位置更新
        FMS->>CallCenter: 到着予定時刻更新
    end

    Mobile->>FMS: 現場到着報告<br/>{到着時刻、GPS位置}
    FMS->>FMS: 応答時間計算・記録<br/>総応答時間: XX分XX秒

    FMS->>CallCenter: 現場到着通知
    deactivate FMS
    CallCenter->>Citizen: 消防隊到着案内
    deactivate CallCenter

    Note over Citizen,Vehicle: データ永続化: PostgreSQL DB
```

---

## 2. 現場活動データフロー

```mermaid
sequenceDiagram
    participant Mobile as 隊員モバイルアプリ
    participant FMS as FMSシステム
    participant CommandCenter as 指令センター
    participant IoT as IoTセンサー
    participant Media as メディアストレージ
    participant DB as データベース

    Note over Mobile,DB: フェーズ1: 現場到着・初期評価

    Mobile->>FMS: 現場到着報告<br/>{インシデントID、到着時刻、GPS}
    activate FMS
    
    FMS->>FMS: インシデント状態更新<br/>状態: 出動中 → 活動中

    Mobile->>FMS: 初期評価レポート<br/>{火災規模、延焼状況、人命危険}
    
    FMS->>CommandCenter: リアルタイム状況表示
    activate CommandCenter

    Note over Mobile,DB: フェーズ2: 追加応援要請（必要時）

    alt 応援が必要な場合
        Mobile->>FMS: 応援要請<br/>{必要車両数、必要人員、理由}
        FMS->>FMS: 応援可能車両検索
        FMS->>CommandCenter: 応援推奨表示
        CommandCenter->>FMS: 応援承認<br/>{追加車両ID}
        FMS->>Mobile: 応援到着予定通知
    end

    Note over Mobile,DB: フェーズ3: 活動中のリアルタイムデータ

    loop 活動中（1分間隔）
        Mobile->>FMS: 活動状況更新<br/>{隊員位置、活動内容、進捗}
        
        IoT->>FMS: センサーデータ<br/>{隊員バイタル、環境温度、ガス濃度}
        activate IoT
        
        FMS->>FMS: 安全閾値チェック
        
        alt 危険検知時
            FMS->>Mobile: 緊急アラート<br/>{危険種別、退避指示}
            FMS->>CommandCenter: 緊急通知
        end
        deactivate IoT
        
        FMS->>CommandCenter: ダッシュボード更新<br/>{地図、タイムライン、メトリクス}
    end

    Note over Mobile,DB: フェーズ4: 現場メディア記録

    Mobile->>Mobile: 写真・動画撮影<br/>(延焼状況、被害状況)
    Mobile->>Media: メディアファイルアップロード<br/>{画像、メタデータ、GPS、タイムスタンプ}
    activate Media
    Media->>Media: ファイル圧縮・最適化
    Media-->>FMS: アップロード完了通知<br/>{ファイルID、URL}
    deactivate Media
    
    FMS->>DB: メディア参照保存<br/>{インシデントID、ファイルID、種別}
    activate DB

    Note over Mobile,DB: フェーズ5: 鎮火・活動終了

    Mobile->>FMS: 鎮火報告<br/>{鎮火時刻、最終状況}
    FMS->>FMS: 活動時間計算<br/>- 到着〜鎮火: XX分<br/>- 総活動時間: XX分

    Mobile->>FMS: デジタル報告書作成<br/>{火災原因、被害状況、使用資機材}
    FMS->>DB: 報告書データ保存
    
    FMS->>CommandCenter: 活動完了通知
    deactivate CommandCenter

    Note over Mobile,DB: フェーズ6: 帰署・機材点検

    Mobile->>FMS: 帰署報告<br/>{帰署時刻}
    
    Mobile->>FMS: 機材点検チェックリスト<br/>{装備品状態、消耗品補充、故障箇所}
    FMS->>DB: 機材状態更新

    Mobile->>FMS: 車両燃料・走行距離記録<br/>{燃料消費量、走行距離}
    FMS->>DB: 車両履歴更新

    Note over Mobile,DB: フェーズ7: インシデントクローズ

    FMS->>FMS: インシデント完了処理<br/>- 全データ検証<br/>- タイムライン確定<br/>- KPI計算

    FMS->>DB: 最終データ保存<br/>状態: 活動中 → 完了
    deactivate DB
    
    deactivate FMS

    Note over Mobile,DB: すべてのデータは監査証跡付きでPostgreSQLに永続化
```

---

## 3. システム間データ連携フロー

```mermaid
graph TB
    subgraph External["外部システム"]
        EMERGENCY[緊急通報センター<br/>112/911]
        POLICE[警察システム<br/>CAD]
        EMS[救急医療サービス<br/>EMS]
        WEATHER[気象情報API<br/>天候・風向]
        TRAFFIC[交通情報API<br/>渋滞・規制]
        UTILITY[ライフライン<br/>電気・ガス・水道]
    end

    subgraph FMS_Core["FMS コアシステム"]
        API_GW[APIゲートウェイ<br/>認証・ルーティング]
        ESB[エンタープライズ<br/>サービスバス]
        
        subgraph Services["マイクロサービス"]
            DISPATCH_SVC[出動管理サービス]
            INCIDENT_SVC[インシデント管理サービス]
            GIS_SVC[GISサービス]
            NOTIF_SVC[通知サービス]
        end
        
        QUEUE[メッセージキュー<br/>Kafka/RabbitMQ]
        CACHE[キャッシュ層<br/>Redis]
        DB[(メインDB<br/>PostgreSQL)]
    end

    subgraph Internal["内部システム"]
        CAD[コンピュータ支援<br/>出動システム]
        GIS_INTERNAL[GISマッピング<br/>システム]
        ASSET[資産管理<br/>システム]
        HR[人事・勤怠<br/>システム]
    end

    %% 外部システムからFMSへ
    EMERGENCY -->|通報データ<br/>REST API| API_GW
    POLICE -->|協力要請<br/>REST API| API_GW
    EMS -->|医療対応情報<br/>REST API| API_GW
    WEATHER -->|気象データ<br/>REST API| API_GW
    TRAFFIC -->|交通情報<br/>REST API| API_GW
    UTILITY -->|インフラ情報<br/>WebSocket| API_GW

    %% APIゲートウェイからESBへ
    API_GW -->|認証済みリクエスト| ESB

    %% ESBから各サービスへ
    ESB -->|出動要求| DISPATCH_SVC
    ESB -->|インシデント作成| INCIDENT_SVC
    ESB -->|位置情報照会| GIS_SVC
    ESB -->|通知送信| NOTIF_SVC

    %% サービス間通信
    DISPATCH_SVC -->|イベント発行| QUEUE
    INCIDENT_SVC -->|イベント発行| QUEUE
    QUEUE -->|イベント購読| NOTIF_SVC
    QUEUE -->|イベント購読| GIS_SVC

    %% キャッシュ利用
    DISPATCH_SVC <-->|頻繁アクセスデータ| CACHE
    GIS_SVC <-->|地図タイル| CACHE

    %% データベース永続化
    DISPATCH_SVC -->|出動記録| DB
    INCIDENT_SVC -->|インシデントデータ| DB
    GIS_SVC -->|位置履歴| DB

    %% 内部システム連携
    DB <-->|双方向同期| CAD
    GIS_SVC <-->|地図データ交換| GIS_INTERNAL
    DISPATCH_SVC <-->|車両状態同期| ASSET
    INCIDENT_SVC <-->|隊員情報照会| HR

    %% FMSから外部システムへ
    NOTIF_SVC -->|状況更新<br/>WebHook| EMERGENCY
    INCIDENT_SVC -->|現場情報共有<br/>REST API| POLICE
    INCIDENT_SVC -->|傷病者情報<br/>REST API| EMS

    style External fill:#fca5a5
    style FMS_Core fill:#93c5fd
    style Internal fill:#a5f3fc
```

---

## 4. リアルタイムデータフロー

```mermaid
sequenceDiagram
    participant Vehicle as 消防車両<br/>(GPS搭載)
    participant Mobile as モバイルアプリ
    participant WebSocket as WebSocketサーバー
    participant Redis as Redisキャッシュ
    participant DB as PostgreSQL
    participant Dashboard as 指令センター<br/>ダッシュボード
    participant Map as GIS地図表示

    Note over Vehicle,Map: WebSocketによるリアルタイム双方向通信

    Vehicle->>Mobile: GPS位置取得<br/>(5秒間隔)
    activate Mobile
    
    Mobile->>Mobile: 位置データ整形<br/>{vehicleId, lat, lng, speed, heading, timestamp}
    
    Mobile->>WebSocket: WebSocket送信<br/>JSON over WSS
    activate WebSocket
    
    WebSocket->>Redis: 最新位置をキャッシュ<br/>Key: vehicle:{id}:location<br/>TTL: 60秒
    activate Redis
    
    par 並行処理
        WebSocket->>Dashboard: リアルタイムプッシュ<br/>車両位置更新
        activate Dashboard
        Dashboard->>Map: 地図上のアイコン移動
        activate Map
        deactivate Map
        deactivate Dashboard
    and
        WebSocket->>DB: 位置履歴保存<br/>(バッチ処理: 30秒毎)
        activate DB
        DB->>DB: TimescaleDB<br/>時系列データ最適化
        deactivate DB
    end
    
    deactivate Redis
    deactivate WebSocket
    deactivate Mobile

    Note over Vehicle,Map: 隊員バイタルサインのリアルタイム監視

    loop 1分間隔
        Vehicle->>Mobile: ウェアラブルデータ取得<br/>{心拍数、体温、酸素飽和度}
        Mobile->>WebSocket: バイタルデータ送信
        WebSocket->>Redis: バイタル値キャッシュ
        
        WebSocket->>WebSocket: 閾値チェック<br/>心拍 > 180 or 体温 > 39℃
        
        alt 異常値検知
            WebSocket->>Dashboard: 🚨 緊急アラート表示
            WebSocket->>Mobile: プッシュ通知<br/>"隊員の体調異常を検知"
            WebSocket->>DB: アラート記録保存
        end
        
        WebSocket->>Dashboard: バイタルグラフ更新
    end

    Note over Vehicle,Map: インシデント状況のリアルタイム更新

    Dashboard->>WebSocket: 状況コメント投稿<br/>"北側から延焼拡大中"
    activate WebSocket
    WebSocket->>Redis: 更新情報キャッシュ
    WebSocket->>Mobile: 全隊員へブロードキャスト
    activate Mobile
    Mobile->>Mobile: 通知音・画面表示
    deactivate Mobile
    WebSocket->>DB: コメント永続化
    deactivate WebSocket

    Note over Vehicle,Map: データ整合性確保

    Redis->>DB: 定期同期 (5分毎)<br/>キャッシュデータをDBへ
    DB->>DB: データ整合性検証<br/>トランザクションログ確認
```

---

## 5. 分析・レポーティングデータフロー

```mermaid
graph LR
    subgraph Sources["データソース"]
        INCIDENTS[(インシデントDB<br/>PostgreSQL)]
        LOCATIONS[(位置履歴DB<br/>TimescaleDB)]
        ASSETS[(資産管理DB)]
        PERSONNEL[(人事DB)]
        IOT_SENSORS[(IoTセンサーデータ)]
        LOGS[アプリケーション<br/>ログ ELK]
    end

    subgraph ETL["ETLパイプライン"]
        EXTRACT[データ抽出<br/>Apache NiFi]
        TRANSFORM[データ変換<br/>dbt/Airflow]
        VALIDATE[データ検証<br/>品質チェック]
        LOAD[データロード<br/>バッチ処理]
    end

    subgraph DWH["データウェアハウス"]
        STAGING[(ステージング層<br/>生データ)]
        CORE[(コア層<br/>スタースキーマ)]
        FACT[ファクトテーブル<br/>- 出動記録<br/>- 活動記録<br/>- 使用資機材]
        DIM[ディメンションテーブル<br/>- 時間<br/>- 場所<br/>- 車両<br/>- 隊員]
        MARTS[(データマート<br/>部門別集約)]
    end

    subgraph Analytics["分析レイヤー"]
        BI[BIツール<br/>Power BI/Tableau]
        ML[機械学習<br/>Python/scikit-learn]
        REPORTS[自動レポート<br/>スケジュール実行]
    end

    subgraph Outputs["出力・可視化"]
        EXEC_DASH[📊 経営ダッシュボード<br/>- KPI概要<br/>- 予算執行状況]
        OPS_DASH[📈 運用ダッシュボード<br/>- 応答時間<br/>- 車両稼働率]
        PRED[🔮 予測分析<br/>- 火災リスクマップ<br/>- 最適配置提案]
        COMPLIANCE[📋 コンプライアンス<br/>レポート]
    end

    %% データソースからETLへ
    INCIDENTS -->|毎日 2:00 AM| EXTRACT
    LOCATIONS -->|毎日 2:00 AM| EXTRACT
    ASSETS -->|毎日 2:00 AM| EXTRACT
    PERSONNEL -->|毎日 2:00 AM| EXTRACT
    IOT_SENSORS -->|毎時| EXTRACT
    LOGS -->|毎時| EXTRACT

    %% ETLパイプライン
    EXTRACT --> TRANSFORM
    TRANSFORM --> VALIDATE
    VALIDATE --> LOAD

    %% データウェアハウス構築
    LOAD --> STAGING
    STAGING --> CORE
    CORE --> FACT
    CORE --> DIM
    FACT --> MARTS
    DIM --> MARTS

    %% 分析レイヤー
    MARTS --> BI
    MARTS --> ML
    MARTS --> REPORTS

    %% 出力生成
    BI --> EXEC_DASH
    BI --> OPS_DASH
    ML --> PRED
    REPORTS --> COMPLIANCE

    %% スタイル
    style Sources fill:#fef3c7
    style ETL fill:#dbeafe
    style DWH fill:#e0e7ff
    style Analytics fill:#e9d5ff
    style Outputs fill:#d1fae5
```

### 分析データフロー詳細シーケンス

```mermaid
sequenceDiagram
    participant Scheduler as スケジューラー<br/>(Airflow)
    participant Extract as 抽出サービス
    participant Source as ソースDB
    participant Transform as 変換サービス
    participant Staging as ステージングDB
    participant DWH as データウェアハウス
    participant ML as 機械学習サービス
    participant BI as BIツール

    Note over Scheduler,BI: 日次バッチ処理 (毎日 2:00 AM)

    Scheduler->>Extract: ETLジョブ起動
    activate Extract
    
    Extract->>Source: 前日分データ抽出<br/>SELECT * WHERE date = yesterday
    activate Source
    Source-->>Extract: データセット返却<br/>(CSV/Parquet)
    deactivate Source

    Extract->>Staging: 生データ投入
    activate Staging
    deactivate Extract

    Scheduler->>Transform: 変換ジョブ起動
    activate Transform

    Transform->>Staging: 生データ読み込み
    Staging-->>Transform: データ返却

    Transform->>Transform: データクレンジング<br/>- NULL値処理<br/>- 重複除去<br/>- 型変換

    Transform->>Transform: ビジネスロジック適用<br/>- KPI計算<br/>- 集約処理<br/>- 参照整合性確保

    Transform->>DWH: 変換済みデータ投入<br/>- ファクトテーブル更新<br/>- ディメンション更新
    activate DWH
    deactivate Transform
    deactivate Staging

    Note over Scheduler,BI: 機械学習モデル更新 (週次)

    Scheduler->>ML: モデル学習ジョブ起動
    activate ML
    
    ML->>DWH: 学習データ取得<br/>過去6ヶ月分
    DWH-->>ML: 学習用データセット

    ML->>ML: 特徴量エンジニアリング<br/>- 時間的特徴抽出<br/>- 地理的特徴抽出<br/>- カテゴリ変数エンコード

    ML->>ML: モデル学習<br/>- 火災発生予測モデル<br/>- 応答時間予測モデル<br/>- 最適配置モデル

    ML->>ML: モデル評価<br/>- 精度検証<br/>- 交差検証<br/>- A/Bテスト

    ML->>DWH: 予測結果保存
    deactivate ML

    Note over Scheduler,BI: BIダッシュボード更新

    Scheduler->>BI: キャッシュ更新ジョブ
    activate BI
    
    BI->>DWH: 集約データクエリ<br/>- 当日KPI<br/>- 月間統計<br/>- 年間トレンド
    DWH-->>BI: 集約結果
    
    BI->>BI: ダッシュボード再生成<br/>- グラフ作成<br/>- レポート生成

    BI->>BI: レポート配信<br/>Email/PDF添付
    deactivate BI
    deactivate DWH

    Note over Scheduler,BI: 全処理完了・ログ記録
```

---

## 6. 査察・予防データフロー

```mermaid
sequenceDiagram
    participant Inspector as 査察員<br/>モバイルアプリ
    participant FMS as FMSシステム
    participant Building as 建物DB
    participant GIS as GISシステム
    participant Violation as 違反追跡システム
    participant Notification as 通知サービス
    participant Owner as 建物所有者

    Note over Inspector,Owner: フェーズ1: 査察計画・スケジューリング

    FMS->>Building: リスクベース査察対象抽出<br/>- 前回査察日<br/>- 建物用途<br/>- 違反履歴
    activate Building
    Building-->>FMS: 対象建物リスト
    deactivate Building

    FMS->>GIS: 地理的クラスタリング<br/>効率的ルート生成
    activate GIS
    GIS-->>FMS: 最適査察ルート
    deactivate GIS

    FMS->>Inspector: 査察スケジュール配信<br/>{日付、建物リスト、ルート}
    activate Inspector

    Note over Inspector,Owner: フェーズ2: 現地査察実施

    Inspector->>FMS: 査察開始報告<br/>{建物ID、開始時刻、GPS位置}
    activate FMS

    FMS->>Inspector: デジタルチェックリスト送信<br/>{建物種別に応じた項目}
    
    loop 各チェック項目
        Inspector->>Inspector: 現地確認・評価<br/>- 消火設備<br/>- 避難経路<br/>- 防火区画
        
        alt 不備・違反発見
            Inspector->>Inspector: 写真撮影<br/>位置情報付き
            Inspector->>FMS: 違反事項報告<br/>{項目、重大度、写真、位置}
            FMS->>Violation: 違反記録作成<br/>{建物ID、違反内容、期限}
            activate Violation
        end
    end

    Inspector->>FMS: 査察完了報告<br/>{総合評価、所見、次回査察推奨日}
    
    Note over Inspector,Owner: フェーズ3: 違反是正通知

    alt 違反が存在する場合
        FMS->>Building: 建物所有者情報取得
        Building-->>FMS: 所有者連絡先
        
        FMS->>Notification: 是正通知書生成<br/>{違反内容、是正期限、罰則}
        activate Notification
        
        Notification->>Owner: 通知送信<br/>Email + 書面郵送
        activate Owner
        
        Notification->>Violation: 通知送信記録
        deactivate Notification
    end

    Note over Inspector,Owner: フェーズ4: 是正確認・フォローアップ

    Owner->>FMS: 是正完了報告<br/>(任意: Webポータル経由)
    deactivate Owner
    
    FMS->>Inspector: 再査察スケジュール自動生成<br/>{是正期限の7日前}
    
    Inspector->>FMS: 再査察実施<br/>是正状況確認
    
    alt 是正完了確認
        Inspector->>Violation: 違反クローズ<br/>{是正確認日、写真}
        Violation->>Building: 建物評価更新<br/>リスクスコア改善
        deactivate Violation
    else 是正未完了
        Inspector->>Violation: 違反エスカレーション<br/>法的措置フラグ
        FMS->>Notification: 警告通知送信
    end

    FMS->>Building: 査察履歴更新<br/>{査察日、結果、次回予定日}
    deactivate Building

    Inspector->>FMS: 査察データ同期完了
    deactivate Inspector
    deactivate FMS

    Note over Inspector,Owner: 全データはPostgreSQLに永続化・監査証跡保持
```

---

## 7. IoTセンサーデータフロー

```mermaid
graph TB
    subgraph Field["現場デバイス層"]
        WEARABLE[ウェアラブルデバイス<br/>心拍・体温・位置]
        VEHICLE_SENSOR[車載センサー<br/>燃料・速度・エンジン]
        BUILDING_SENSOR[建物センサー<br/>煙感知器・スプリンクラー]
        HYDRANT[スマート消火栓<br/>水圧・使用状況]
        ENV_SENSOR[環境センサー<br/>気温・湿度・風速]
    end

    subgraph Edge["エッジコンピューティング層"]
        GATEWAY[IoTゲートウェイ<br/>データ集約・フィルタリング]
        EDGE_PROC[エッジ処理<br/>リアルタイム分析]
        LOCAL_CACHE[ローカルキャッシュ<br/>オフライン対応]
    end

    subgraph Transport["通信層"]
        MQTT[MQTTブローカー<br/>軽量メッセージング]
        LORAWAN[LoRaWANゲートウェイ<br/>長距離通信]
        CELLULAR[セルラー通信<br/>4G/5G]
    end

    subgraph Cloud["クラウド処理層"]
        IOT_HUB[IoTハブ<br/>デバイス管理]
        STREAM[ストリーム処理<br/>Apache Kafka]
        RULES[ルールエンジン<br/>閾値判定]
        ALERT[アラートエンジン<br/>通知生成]
    end

    subgraph Storage["ストレージ層"]
        TSDB[(時系列DB<br/>InfluxDB/TimescaleDB)]
        POSTGRES[(メインDB<br/>PostgreSQL)]
        S3[オブジェクトストレージ<br/>生データアーカイブ]
    end

    subgraph Analytics["分析・可視化層"]
        REALTIME_DASH[リアルタイム<br/>ダッシュボード]
        ML_INFERENCE[ML推論<br/>異常検知]
        HISTORICAL[履歴分析<br/>トレンド可視化]
    end

    %% デバイスからエッジへ
    WEARABLE -->|Bluetooth| GATEWAY
    VEHICLE_SENSOR -->|CAN Bus| GATEWAY
    BUILDING_SENSOR -->|LoRaWAN| LORAWAN
    HYDRANT -->|LoRaWAN| LORAWAN
    ENV_SENSOR -->|4G/5G| CELLULAR

    %% エッジ処理
    GATEWAY --> EDGE_PROC
    LORAWAN --> EDGE_PROC
    CELLULAR --> EDGE_PROC
    EDGE_PROC --> LOCAL_CACHE

    %% 通信層へ
    EDGE_PROC -->|MQTT| MQTT
    LOCAL_CACHE -.オフライン時.-> LOCAL_CACHE
    LOCAL_CACHE -.オンライン復帰.-> MQTT

    %% クラウド処理
    MQTT --> IOT_HUB
    IOT_HUB --> STREAM
    STREAM --> RULES
    RULES --> ALERT

    %% データ保存
    STREAM -->|時系列データ| TSDB
    STREAM -->|メタデータ| POSTGRES
    STREAM -->|生データ| S3

    %% 分析・可視化
    TSDB --> REALTIME_DASH
    TSDB --> ML_INFERENCE
    TSDB --> HISTORICAL
    
    ALERT --> REALTIME_DASH
    ML_INFERENCE --> ALERT

    %% スタイル
    style Field fill:#fecaca
    style Edge fill:#fed7aa
    style Transport fill:#fde68a
    style Cloud fill:#a7f3d0
    style Storage fill:#a5b4fc
    style Analytics fill:#e9d5ff
```

### IoTデータ処理詳細シーケンス

```mermaid
sequenceDiagram
    participant Device as IoTデバイス<br/>(ウェアラブル)
    participant Gateway as IoTゲートウェイ
    participant MQTT as MQTTブローカー
    participant Stream as ストリーム処理<br/>(Kafka)
    participant Rules as ルールエンジン
    participant TSDB as 時系列DB<br/>(InfluxDB)
    participant Alert as アラートシステム
    participant Dashboard as ダッシュボード

    Note over Device,Dashboard: リアルタイムデータストリーミング (1秒間隔)

    loop 連続モニタリング
        Device->>Device: センサー読み取り<br/>{心拍数、体温、SpO2、位置}
        
        Device->>Gateway: データ送信 (Bluetooth)<br/>JSON: {deviceId, timestamp, metrics}
        activate Gateway
        
        Gateway->>Gateway: データ検証・正規化<br/>- 範囲チェック<br/>- 欠損値補完
        
        Gateway->>MQTT: パブリッシュ<br/>Topic: sensors/wearable/{deviceId}
        activate MQTT
        deactivate Gateway
        
        MQTT->>Stream: メッセージ配信
        activate Stream
        deactivate MQTT
        
        Stream->>Stream: ストリーム処理<br/>- ウィンドウ集約 (5秒)<br/>- 移動平均計算
        
        par 並行処理
            Stream->>TSDB: 時系列データ保存<br/>高速書き込み
            activate TSDB
            TSDB->>TSDB: データ圧縮・インデックス化
            deactivate TSDB
        and
            Stream->>Rules: ルール評価
            activate Rules
            
            Rules->>Rules: 閾値チェック<br/>心拍 > 180 bpm?<br/>体温 > 39°C?<br/>SpO2 < 90%?
            
            alt 異常検知
                Rules->>Alert: アラート生成<br/>{level: CRITICAL, message, deviceId}
                activate Alert
                
                Alert->>Dashboard: 🚨 緊急通知プッシュ<br/>WebSocket
                activate Dashboard
                Dashboard->>Dashboard: 警告音・画面点滅
                deactivate Dashboard
                
                Alert->>Alert: SMS/Email送信<br/>→ 指令員
                deactivate Alert
                
                Rules->>TSDB: アラートイベント記録
            end
            deactivate Rules
        and
            Stream->>Dashboard: リアルタイム更新<br/>WebSocket
            Dashboard->>Dashboard: グラフ・メーター更新
        end
        
        deactivate Stream
    end

    Note over Device,Dashboard: データ保持ポリシー<br/>- 生データ: 7日間<br/>- 集約データ (1分): 30日間<br/>- 集約データ (1時間): 1年間
```

---

## 8. モバイルアプリデータ同期フロー

```mermaid
sequenceDiagram
    participant Mobile as モバイルアプリ
    participant LocalDB as ローカルDB<br/>(SQLite)
    participant SyncService as 同期サービス
    participant API as REST API
    participant CloudDB as クラウドDB<br/>(PostgreSQL)
    participant Storage as クラウドストレージ<br/>(S3)

    Note over Mobile,Storage: オフライン時の動作

    Mobile->>LocalDB: データ書き込み<br/>(ローカル優先)
    activate LocalDB
    LocalDB->>LocalDB: 同期待ちキュー追加<br/>sync_status = 'pending'
    deactivate LocalDB

    Mobile->>LocalDB: 写真・動画保存<br/>(ローカルストレージ)
    activate LocalDB
    LocalDB->>LocalDB: メディアキュー追加<br/>upload_status = 'pending'
    deactivate LocalDB

    Note over Mobile,Storage: オンライン復帰時の自動同期

    Mobile->>SyncService: ネットワーク検知<br/>同期開始
    activate SyncService

    SyncService->>LocalDB: 同期待ちデータ取得<br/>WHERE sync_status = 'pending'
    activate LocalDB
    LocalDB-->>SyncService: 同期対象リスト<br/>[record1, record2, ...]
    deactivate LocalDB

    Note over Mobile,Storage: データ競合解決戦略

    loop 各レコード
        SyncService->>API: データアップロード<br/>POST /api/sync
        activate API
        
        API->>CloudDB: タイムスタンプ確認<br/>競合チェック
        activate CloudDB
        
        alt 競合なし
            CloudDB->>CloudDB: データ挿入/更新
            CloudDB-->>API: 成功レスポンス<br/>{status: 'ok', serverId}
        else 競合あり (サーバー側が新しい)
            CloudDB-->>API: 競合レスポンス<br/>{status: 'conflict', serverData}
            API->>SyncService: サーバーデータ優先<br/>クライアント上書き
            SyncService->>LocalDB: ローカルデータ更新
        end
        deactivate CloudDB
        
        API-->>SyncService: 同期結果
        deactivate API
        
        SyncService->>LocalDB: sync_status = 'synced'<br/>server_id保存
    end

    Note over Mobile,Storage: メディアファイル同期

    SyncService->>LocalDB: 未アップロードメディア取得
    activate LocalDB
    LocalDB-->>SyncService: メディアファイルリスト
    deactivate LocalDB

    loop 各メディアファイル
        SyncService->>SyncService: 画像圧縮・最適化<br/>JPEG品質80%, リサイズ
        
        SyncService->>API: マルチパート送信<br/>POST /api/media/upload
        activate API
        
        API->>Storage: S3アップロード<br/>presigned URL使用
        activate Storage
        Storage-->>API: アップロード完了<br/>{fileUrl, fileId}
        deactivate Storage
        
        API->>CloudDB: メディアメタデータ保存<br/>{fileId, url, recordId}
        activate CloudDB
        CloudDB-->>API: 保存完了
        deactivate CloudDB
        
        API-->>SyncService: アップロード成功
        deactivate API
        
        SyncService->>LocalDB: upload_status = 'uploaded'<br/>file_url保存
        activate LocalDB
        
        alt ストレージ容量確保が必要
            LocalDB->>LocalDB: ローカルファイル削除<br/>(クラウドに存在確認済み)
        end
        deactivate LocalDB
    end

    Note over Mobile,Storage: サーバーからの差分ダウンロード

    SyncService->>API: 差分データ要求<br/>GET /api/sync/delta?since={lastSyncTime}
    activate API
    
    API->>CloudDB: 差分クエリ<br/>WHERE updated_at > lastSyncTime
    activate CloudDB
    CloudDB-->>API: 更新データリスト
    deactivate CloudDB
    
    API-->>SyncService: 差分データ返却<br/>[newRecord1, updatedRecord2, ...]
    deactivate API

    SyncService->>LocalDB: ローカルDB更新<br/>INSERT/UPDATE
    activate LocalDB
    LocalDB->>LocalDB: 最終同期時刻記録<br/>last_sync_time = now()
    deactivate LocalDB

    SyncService->>Mobile: 同期完了通知<br/>{synced: 15, conflicts: 0}
    deactivate SyncService

    Mobile->>Mobile: UI更新・通知表示<br/>"同期完了: 15件"

    Note over Mobile,Storage: 同期ステータス永続化<br/>次回起動時の差分同期に利用
```

---

## データフロー サマリー

### 主要データパス

| データ種別 | 発生源 | 処理方法 | 保存先 | リアルタイム性 |
|----------|--------|---------|--------|--------------|
| **緊急通報データ** | 112/911センター | REST API → 出動管理サービス | PostgreSQL | < 1秒 |
| **GPS位置情報** | 消防車両 | WebSocket → Redis → DB | Redis + PostgreSQL | 5秒間隔 |
| **バイタルサイン** | ウェアラブル | MQTT → Kafka → 時系列DB | InfluxDB | 1秒間隔 |
| **現場写真・動画** | モバイルアプリ | マルチパート → S3 | S3 + メタデータDB | 非同期 |
| **査察チェックリスト** | 査察員アプリ | オフライン → 同期 | SQLite → PostgreSQL | バッチ同期 |
| **分析レポート** | データウェアハウス | ETLバッチ | Data Warehouse | 日次バッチ |

### データ保持ポリシー

| データ種別 | 保持期間 | アーカイブ戦略 |
|----------|---------|--------------|
| **インシデント記録** | 永久保存 | 5年後にコールドストレージ |
| **GPS位置履歴（生データ）** | 90日 | 1分集約データに変換 |
| **バイタルサイン（生データ）** | 7日 | 5分集約データに変換 |
| **メディアファイル** | 永久保存 | 1年後に圧縮・アーカイブ |
| **アプリケーションログ** | 30日 | 重要ログのみ永久保存 |
| **分析用集約データ** | 永久保存 | 年次アーカイブ |

---

## まとめ

本ドキュメントでは、FMSシステムにおける8つの主要なデータフローを詳細に解説しました：

1. **緊急通報から出動まで** - エンドツーエンドの出動プロセス
2. **現場活動** - リアルタイム活動記録と安全監視
3. **システム間連携** - 外部システムとのデータ交換
4. **リアルタイムデータ** - WebSocketによる双方向通信
5. **分析・レポーティング** - ETLパイプラインとBI
6. **査察・予防** - デジタル査察ワークフロー
7. **IoTセンサー** - エッジからクラウドまでのIoTデータ処理
8. **モバイル同期** - オフライン対応とデータ競合解決

これらのデータフローは、FMSが**高速・高信頼性・スケーラブル**なシステムとして機能するための基盤となっています。
