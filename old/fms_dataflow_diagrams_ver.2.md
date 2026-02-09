# Integrated Fire Management System (FMS) - Data Flow Diagrams

## Table of Contents
1. [Emergency Call to Dispatch - Complete Flow](#1-emergency-call-to-dispatch---complete-flow)
2. [On-Scene Operations Data Flow](#2-on-scene-operations-data-flow)
3. [Cross-System Data Integration Flow](#3-cross-system-data-integration-flow)
4. [Real-time Data Flow](#4-real-time-data-flow)
5. [Analytics & Reporting Data Flow](#5-analytics--reporting-data-flow)
6. [Inspection & Prevention Data Flow](#6-inspection--prevention-data-flow)
7. [IoT Sensor Data Flow](#7-iot-sensor-data-flow)
8. [Mobile App Data Synchronization Flow](#8-mobile-app-data-synchronization-flow)

---

## 1. Emergency Call to Dispatch - Complete Flow

```mermaid
sequenceDiagram
    participant Citizen as Citizen
    participant CallCenter as Emergency Call Center<br/>(112/911)
    participant FMS as FMS System
    participant GIS as GIS System
    participant Dispatcher as Dispatcher
    participant FireStation as Fire Station System
    participant Mobile as Personnel Mobile App
    participant Vehicle as Fire Vehicle

    Note over Citizen,Vehicle: Phase 1: Call Reception & Location Identification
    Citizen->>CallCenter: Emergency Call
    activate CallCenter
    CallCenter->>FMS: Call Data Transmission<br/>{phone number, location info}
    activate FMS
    
    FMS->>GIS: GPS Coordinates Request<br/>{phone number, cell tower info}
    activate GIS
    GIS-->>FMS: Coordinate Data<br/>{latitude, longitude, accuracy}
    deactivate GIS
    
    FMS->>GIS: Reverse Geocoding
    activate GIS
    GIS-->>FMS: Address Information<br/>{state, city, street address}
    deactivate GIS

    Note over FMS: Data Validation & Normalization

    FMS->>FMS: Jurisdiction Determination<br/>Nearest Station Search

    Note over Citizen,Vehicle: Phase 2: Available Resource Check

    FMS->>FireStation: Vehicle & Personnel Status Query
    activate FireStation
    FireStation-->>FMS: Resource Information<br/>{vehicle ID, status, personnel, equipment}
    deactivate FireStation

    FMS->>FMS: Dispatch Recommendation Algorithm<br/>- Distance calculation<br/>- Vehicle suitability assessment<br/>- Personnel availability check

    Note over Citizen,Vehicle: Phase 3: Dispatcher Decision & Approval

    FMS->>Dispatcher: Display Recommended Dispatch<br/>{recommended vehicles, ETA, route}
    activate Dispatcher
    
    Dispatcher->>FMS: Confirm Dispatch Order<br/>{assigned vehicles, captain, crew, equipment}
    deactivate Dispatcher

    Note over Citizen,Vehicle: Phase 4: Notification & Dispatch

    FMS->>FireStation: Send Dispatch Command<br/>{incident ID, assigned vehicles, destination}
    activate FireStation
    FireStation->>FireStation: Activate Alert Siren<br/>Update Display Boards
    deactivate FireStation

    FMS->>Mobile: Push Notification<br/>{emergency dispatch, address, details}
    activate Mobile
    Mobile->>Mobile: Alert Sound & Vibration<br/>Screen Display
    
    Mobile->>FMS: Dispatch Acknowledgment<br/>{personnel ID, acknowledgment time}
    deactivate Mobile

    FMS->>GIS: Calculate Optimal Route<br/>{origin, destination, real-time traffic}
    activate GIS
    GIS-->>Mobile: Navigation Information<br/>{turn-by-turn, estimated time}
    deactivate GIS

    Note over Citizen,Vehicle: Phase 5: En Route & Tracking

    Mobile->>FMS: Vehicle Departure Report<br/>{departure time, GPS position}
    FMS->>FMS: Incident Timeline Recording<br/>- Call received: XX:XX:XX<br/>- Dispatch order: XX:XX:XX<br/>- Vehicle departure: XX:XX:XX

    loop Real-time Tracking (5-second intervals)
        Mobile->>FMS: GPS Position Transmission<br/>{latitude, longitude, speed, heading}
        FMS->>Dispatcher: Update Vehicle Position on Map
        FMS->>CallCenter: Update Estimated Arrival Time
    end

    Mobile->>FMS: On-Scene Arrival Report<br/>{arrival time, GPS position}
    FMS->>FMS: Response Time Calculation & Recording<br/>Total Response Time: XX min XX sec

    FMS->>CallCenter: On-Scene Arrival Notification
    deactivate FMS
    CallCenter->>Citizen: Fire Unit Arrival Notification
    deactivate CallCenter

    Note over Citizen,Vehicle: Data Persistence: PostgreSQL DB
```

---

## 2. On-Scene Operations Data Flow

```mermaid
sequenceDiagram
    participant Mobile as Personnel Mobile App
    participant FMS as FMS System
    participant CommandCenter as Command Center
    participant IoT as IoT Sensors
    participant Media as Media Storage
    participant DB as Database

    Note over Mobile,DB: Phase 1: On-Scene Arrival & Initial Assessment

    Mobile->>FMS: On-Scene Arrival Report<br/>{incident ID, arrival time, GPS}
    activate FMS
    
    FMS->>FMS: Update Incident Status<br/>Status: En Route → On Scene

    Mobile->>FMS: Initial Assessment Report<br/>{fire size, spread status, life hazard}
    
    FMS->>CommandCenter: Real-time Status Display
    activate CommandCenter

    Note over Mobile,DB: Phase 2: Additional Support Request (if needed)

    alt Additional Support Required
        Mobile->>FMS: Support Request<br/>{required vehicles, personnel, reason}
        FMS->>FMS: Search Available Support Units
        FMS->>CommandCenter: Display Support Recommendation
        CommandCenter->>FMS: Approve Support<br/>{additional vehicle IDs}
        FMS->>Mobile: Support ETA Notification
    end

    Note over Mobile,DB: Phase 3: Real-time Data During Operations

    loop Operations Active (1-minute intervals)
        Mobile->>FMS: Operation Status Update<br/>{personnel location, activity, progress}
        
        IoT->>FMS: Sensor Data<br/>{personnel vitals, ambient temp, gas levels}
        activate IoT
        
        FMS->>FMS: Safety Threshold Check
        
        alt Hazard Detected
            FMS->>Mobile: Emergency Alert<br/>{hazard type, evacuation directive}
            FMS->>CommandCenter: Emergency Notification
        end
        deactivate IoT
        
        FMS->>CommandCenter: Dashboard Update<br/>{map, timeline, metrics}
    end

    Note over Mobile,DB: Phase 4: On-Scene Media Recording

    Mobile->>Mobile: Photo & Video Capture<br/>(fire spread, damage assessment)
    Mobile->>Media: Media File Upload<br/>{images, metadata, GPS, timestamp}
    activate Media
    Media->>Media: File Compression & Optimization
    Media-->>FMS: Upload Complete Notification<br/>{file ID, URL}
    deactivate Media
    
    FMS->>DB: Save Media Reference<br/>{incident ID, file ID, type}
    activate DB

    Note over Mobile,DB: Phase 5: Fire Extinguished & Operations End

    Mobile->>FMS: Fire Extinguished Report<br/>{extinguish time, final status}
    FMS->>FMS: Calculate Operation Duration<br/>- Arrival to Extinguish: XX min<br/>- Total Operation Time: XX min

    Mobile->>FMS: Create Digital Report<br/>{fire cause, damage assessment, equipment used}
    FMS->>DB: Save Report Data
    
    FMS->>CommandCenter: Operations Complete Notification
    deactivate CommandCenter

    Note over Mobile,DB: Phase 6: Return to Station & Equipment Check

    Mobile->>FMS: Return to Station Report<br/>{return time}
    
    Mobile->>FMS: Equipment Check Checklist<br/>{equipment status, consumables refill, defects}
    FMS->>DB: Update Equipment Status

    Mobile->>FMS: Vehicle Fuel & Mileage Record<br/>{fuel consumption, mileage}
    FMS->>DB: Update Vehicle History

    Note over Mobile,DB: Phase 7: Incident Closure

    FMS->>FMS: Incident Completion Processing<br/>- All data validation<br/>- Timeline finalization<br/>- KPI calculation

    FMS->>DB: Save Final Data<br/>Status: On Scene → Completed
    deactivate DB
    
    deactivate FMS

    Note over Mobile,DB: All data persisted in PostgreSQL with audit trail
```

---

## 3. Cross-System Data Integration Flow

```mermaid
graph TB
    subgraph External["External Systems"]
        EMERGENCY[Emergency Call Center<br/>112/911]
        POLICE[Police System<br/>CAD]
        EMS[Emergency Medical Services<br/>EMS]
        WEATHER[Weather API<br/>Weather & Wind]
        TRAFFIC[Traffic Information API<br/>Congestion & Restrictions]
        UTILITY[Utilities<br/>Electricity, Gas, Water]
    end

    subgraph FMS_Core["FMS Core System"]
        API_GW[API Gateway<br/>Authentication & Routing]
        ESB[Enterprise<br/>Service Bus]
        
        subgraph Services["Microservices"]
            DISPATCH_SVC[Dispatch Service]
            INCIDENT_SVC[Incident Management Service]
            GIS_SVC[GIS Service]
            NOTIF_SVC[Notification Service]
        end
        
        QUEUE[Message Queue<br/>Kafka/RabbitMQ]
        CACHE[Cache Layer<br/>Redis]
        DB[(Main DB<br/>PostgreSQL)]
    end

    subgraph Internal["Internal Systems"]
        CAD[Computer-Aided<br/>Dispatch System]
        GIS_INTERNAL[GIS Mapping<br/>System]
        ASSET[Asset Management<br/>System]
        HR[HR & Attendance<br/>System]
    end

    %% External Systems to FMS
    EMERGENCY -->|Call Data<br/>REST API| API_GW
    POLICE -->|Cooperation Request<br/>REST API| API_GW
    EMS -->|Medical Response Info<br/>REST API| API_GW
    WEATHER -->|Weather Data<br/>REST API| API_GW
    TRAFFIC -->|Traffic Info<br/>REST API| API_GW
    UTILITY -->|Infrastructure Info<br/>WebSocket| API_GW

    %% API Gateway to ESB
    API_GW -->|Authenticated Requests| ESB

    %% ESB to Services
    ESB -->|Dispatch Request| DISPATCH_SVC
    ESB -->|Incident Creation| INCIDENT_SVC
    ESB -->|Location Query| GIS_SVC
    ESB -->|Send Notification| NOTIF_SVC

    %% Inter-service Communication
    DISPATCH_SVC -->|Publish Event| QUEUE
    INCIDENT_SVC -->|Publish Event| QUEUE
    QUEUE -->|Subscribe Event| NOTIF_SVC
    QUEUE -->|Subscribe Event| GIS_SVC

    %% Cache Usage
    DISPATCH_SVC <-->|Frequently Accessed Data| CACHE
    GIS_SVC <-->|Map Tiles| CACHE

    %% Database Persistence
    DISPATCH_SVC -->|Dispatch Records| DB
    INCIDENT_SVC -->|Incident Data| DB
    GIS_SVC -->|Location History| DB

    %% Internal System Integration
    DB <-->|Bi-directional Sync| CAD
    GIS_SVC <-->|Map Data Exchange| GIS_INTERNAL
    DISPATCH_SVC <-->|Vehicle Status Sync| ASSET
    INCIDENT_SVC <-->|Personnel Info Query| HR

    %% FMS to External Systems
    NOTIF_SVC -->|Status Update<br/>WebHook| EMERGENCY
    INCIDENT_SVC -->|Scene Info Sharing<br/>REST API| POLICE
    INCIDENT_SVC -->|Patient Information<br/>REST API| EMS

    style External fill:#fca5a5
    style FMS_Core fill:#93c5fd
    style Internal fill:#a5f3fc
```

---

## 4. Real-time Data Flow

```mermaid
sequenceDiagram
    participant Vehicle as Fire Vehicle<br/>(GPS-equipped)
    participant Mobile as Mobile App
    participant WebSocket as WebSocket Server
    participant Redis as Redis Cache
    participant DB as PostgreSQL
    participant Dashboard as Command Center<br/>Dashboard
    participant Map as GIS Map Display

    Note over Vehicle,Map: Real-time Bi-directional Communication via WebSocket

    Vehicle->>Mobile: Acquire GPS Position<br/>(5-second intervals)
    activate Mobile
    
    Mobile->>Mobile: Format Position Data<br/>{vehicleId, lat, lng, speed, heading, timestamp}
    
    Mobile->>WebSocket: WebSocket Transmission<br/>JSON over WSS
    activate WebSocket
    
    WebSocket->>Redis: Cache Latest Position<br/>Key: vehicle:{id}:location<br/>TTL: 60 seconds
    activate Redis
    
    par Parallel Processing
        WebSocket->>Dashboard: Real-time Push<br/>Vehicle Position Update
        activate Dashboard
        Dashboard->>Map: Move Icon on Map
        activate Map
        deactivate Map
        deactivate Dashboard
    and
        WebSocket->>DB: Save Position History<br/>(Batch: every 30 seconds)
        activate DB
        DB->>DB: TimescaleDB<br/>Time-series Optimization
        deactivate DB
    end
    
    deactivate Redis
    deactivate WebSocket
    deactivate Mobile

    Note over Vehicle,Map: Real-time Monitoring of Personnel Vital Signs

    loop 1-minute intervals
        Vehicle->>Mobile: Acquire Wearable Data<br/>{heart rate, body temp, SpO2}
        Mobile->>WebSocket: Vital Data Transmission
        WebSocket->>Redis: Cache Vital Values
        
        WebSocket->>WebSocket: Threshold Check<br/>Heart Rate > 180 or Temp > 39°C
        
        alt Abnormal Value Detected
            WebSocket->>Dashboard: 🚨 Emergency Alert Display
            WebSocket->>Mobile: Push Notification<br/>"Personnel health abnormality detected"
            WebSocket->>DB: Save Alert Record
        end
        
        WebSocket->>Dashboard: Update Vital Graph
    end

    Note over Vehicle,Map: Real-time Incident Status Updates

    Dashboard->>WebSocket: Post Status Comment<br/>"Fire spreading from north side"
    activate WebSocket
    WebSocket->>Redis: Cache Update Information
    WebSocket->>Mobile: Broadcast to All Personnel
    activate Mobile
    Mobile->>Mobile: Alert Sound & Screen Display
    deactivate Mobile
    WebSocket->>DB: Persist Comment
    deactivate WebSocket

    Note over Vehicle,Map: Data Consistency Assurance

    Redis->>DB: Periodic Sync (every 5 minutes)<br/>Cache Data to DB
    DB->>DB: Data Integrity Verification<br/>Transaction Log Check
```

---

## 5. Analytics & Reporting Data Flow

```mermaid
graph LR
    subgraph Sources["Data Sources"]
        INCIDENTS[(Incident DB<br/>PostgreSQL)]
        LOCATIONS[(Location History DB<br/>TimescaleDB)]
        ASSETS[(Asset Management DB)]
        PERSONNEL[(HR DB)]
        IOT_SENSORS[(IoT Sensor Data)]
        LOGS[Application<br/>Logs ELK]
    end

    subgraph ETL["ETL Pipeline"]
        EXTRACT[Data Extraction<br/>Apache NiFi]
        TRANSFORM[Data Transformation<br/>dbt/Airflow]
        VALIDATE[Data Validation<br/>Quality Check]
        LOAD[Data Loading<br/>Batch Processing]
    end

    subgraph DWH["Data Warehouse"]
        STAGING[(Staging Layer<br/>Raw Data)]
        CORE[(Core Layer<br/>Star Schema)]
        FACT[Fact Tables<br/>- Dispatch Records<br/>- Operation Records<br/>- Equipment Usage]
        DIM[Dimension Tables<br/>- Time<br/>- Location<br/>- Vehicles<br/>- Personnel]
        MARTS[(Data Marts<br/>Department Aggregates)]
    end

    subgraph Analytics["Analytics Layer"]
        BI[BI Tools<br/>Power BI/Tableau]
        ML[Machine Learning<br/>Python/scikit-learn]
        REPORTS[Automated Reports<br/>Scheduled Execution]
    end

    subgraph Outputs["Outputs & Visualization"]
        EXEC_DASH[📊 Executive Dashboard<br/>- KPI Overview<br/>- Budget Execution]
        OPS_DASH[📈 Operations Dashboard<br/>- Response Time<br/>- Vehicle Utilization]
        PRED[🔮 Predictive Analytics<br/>- Fire Risk Maps<br/>- Optimal Deployment]
        COMPLIANCE[📋 Compliance<br/>Reports]
    end

    %% Data Sources to ETL
    INCIDENTS -->|Daily 2:00 AM| EXTRACT
    LOCATIONS -->|Daily 2:00 AM| EXTRACT
    ASSETS -->|Daily 2:00 AM| EXTRACT
    PERSONNEL -->|Daily 2:00 AM| EXTRACT
    IOT_SENSORS -->|Hourly| EXTRACT
    LOGS -->|Hourly| EXTRACT

    %% ETL Pipeline
    EXTRACT --> TRANSFORM
    TRANSFORM --> VALIDATE
    VALIDATE --> LOAD

    %% Data Warehouse Construction
    LOAD --> STAGING
    STAGING --> CORE
    CORE --> FACT
    CORE --> DIM
    FACT --> MARTS
    DIM --> MARTS

    %% Analytics Layer
    MARTS --> BI
    MARTS --> ML
    MARTS --> REPORTS

    %% Output Generation
    BI --> EXEC_DASH
    BI --> OPS_DASH
    ML --> PRED
    REPORTS --> COMPLIANCE

    %% Styling
    style Sources fill:#fef3c7
    style ETL fill:#dbeafe
    style DWH fill:#e0e7ff
    style Analytics fill:#e9d5ff
    style Outputs fill:#d1fae5
```

### Analytics Data Flow Detailed Sequence

```mermaid
sequenceDiagram
    participant Scheduler as Scheduler<br/>(Airflow)
    participant Extract as Extraction Service
    participant Source as Source DB
    participant Transform as Transformation Service
    participant Staging as Staging DB
    participant DWH as Data Warehouse
    participant ML as Machine Learning Service
    participant BI as BI Tools

    Note over Scheduler,BI: Daily Batch Processing (Every day at 2:00 AM)

    Scheduler->>Extract: Start ETL Job
    activate Extract
    
    Extract->>Source: Extract Previous Day Data<br/>SELECT * WHERE date = yesterday
    activate Source
    Source-->>Extract: Return Dataset<br/>(CSV/Parquet)
    deactivate Source

    Extract->>Staging: Load Raw Data
    activate Staging
    deactivate Extract

    Scheduler->>Transform: Start Transformation Job
    activate Transform

    Transform->>Staging: Read Raw Data
    Staging-->>Transform: Return Data

    Transform->>Transform: Data Cleansing<br/>- NULL value handling<br/>- Deduplication<br/>- Type conversion

    Transform->>Transform: Apply Business Logic<br/>- KPI calculation<br/>- Aggregation<br/>- Referential integrity

    Transform->>DWH: Load Transformed Data<br/>- Update Fact Tables<br/>- Update Dimensions
    activate DWH
    deactivate Transform
    deactivate Staging

    Note over Scheduler,BI: Machine Learning Model Update (Weekly)

    Scheduler->>ML: Start Model Training Job
    activate ML
    
    ML->>DWH: Acquire Training Data<br/>Past 6 months
    DWH-->>ML: Training Dataset

    ML->>ML: Feature Engineering<br/>- Temporal feature extraction<br/>- Geographic feature extraction<br/>- Categorical encoding

    ML->>ML: Model Training<br/>- Fire occurrence prediction<br/>- Response time prediction<br/>- Optimal deployment model

    ML->>ML: Model Evaluation<br/>- Accuracy verification<br/>- Cross-validation<br/>- A/B testing

    ML->>DWH: Save Prediction Results
    deactivate ML

    Note over Scheduler,BI: BI Dashboard Update

    Scheduler->>BI: Cache Update Job
    activate BI
    
    BI->>DWH: Aggregate Data Query<br/>- Daily KPIs<br/>- Monthly Statistics<br/>- Annual Trends
    DWH-->>BI: Aggregated Results
    
    BI->>BI: Regenerate Dashboard<br/>- Create graphs<br/>- Generate reports

    BI->>BI: Distribute Reports<br/>Email/PDF attachment
    deactivate BI
    deactivate DWH

    Note over Scheduler,BI: All Processing Complete & Log Recording
```

---

## 6. Inspection & Prevention Data Flow

```mermaid
sequenceDiagram
    participant Inspector as Inspector<br/>Mobile App
    participant FMS as FMS System
    participant Building as Building DB
    participant GIS as GIS System
    participant Violation as Violation Tracking System
    participant Notification as Notification Service
    participant Owner as Building Owner

    Note over Inspector,Owner: Phase 1: Inspection Planning & Scheduling

    FMS->>Building: Extract Risk-based Inspection Targets<br/>- Last inspection date<br/>- Building use<br/>- Violation history
    activate Building
    Building-->>FMS: Target Building List
    deactivate Building

    FMS->>GIS: Geographic Clustering<br/>Generate Efficient Route
    activate GIS
    GIS-->>FMS: Optimal Inspection Route
    deactivate GIS

    FMS->>Inspector: Distribute Inspection Schedule<br/>{date, building list, route}
    activate Inspector

    Note over Inspector,Owner: Phase 2: On-site Inspection

    Inspector->>FMS: Inspection Start Report<br/>{building ID, start time, GPS position}
    activate FMS

    FMS->>Inspector: Send Digital Checklist<br/>{items based on building type}
    
    loop Each Checklist Item
        Inspector->>Inspector: On-site Verification & Assessment<br/>- Fire suppression equipment<br/>- Evacuation routes<br/>- Fire compartmentation
        
        alt Defect/Violation Found
            Inspector->>Inspector: Take Photo<br/>with geolocation
            Inspector->>FMS: Report Violation<br/>{item, severity, photo, location}
            FMS->>Violation: Create Violation Record<br/>{building ID, violation content, deadline}
            activate Violation
        end
    end

    Inspector->>FMS: Inspection Complete Report<br/>{overall assessment, findings, next inspection date}
    
    Note over Inspector,Owner: Phase 3: Violation Correction Notice

    alt Violations Exist
        FMS->>Building: Get Building Owner Info
        Building-->>FMS: Owner Contact Information
        
        FMS->>Notification: Generate Correction Notice<br/>{violation content, correction deadline, penalties}
        activate Notification
        
        Notification->>Owner: Send Notification<br/>Email + Postal Mail
        activate Owner
        
        Notification->>Violation: Record Notification Sent
        deactivate Notification
    end

    Note over Inspector,Owner: Phase 4: Correction Verification & Follow-up

    Owner->>FMS: Correction Complete Report<br/>(Optional: via Web Portal)
    deactivate Owner
    
    FMS->>Inspector: Auto-generate Re-inspection Schedule<br/>{7 days before correction deadline}
    
    Inspector->>FMS: Conduct Re-inspection<br/>Verify correction status
    
    alt Correction Confirmed
        Inspector->>Violation: Close Violation<br/>{verification date, photo}
        Violation->>Building: Update Building Assessment<br/>Improve risk score
        deactivate Violation
    else Correction Incomplete
        Inspector->>Violation: Escalate Violation<br/>Flag for legal action
        FMS->>Notification: Send Warning Notice
    end

    FMS->>Building: Update Inspection History<br/>{inspection date, result, next scheduled date}
    deactivate Building

    Inspector->>FMS: Inspection Data Sync Complete
    deactivate Inspector
    deactivate FMS

    Note over Inspector,Owner: All data persisted in PostgreSQL with audit trail
```

---

## 7. IoT Sensor Data Flow

```mermaid
graph TB
    subgraph Field["Field Device Layer"]
        WEARABLE[Wearable Devices<br/>Heart Rate, Temperature, Location]
        VEHICLE_SENSOR[Vehicle Sensors<br/>Fuel, Speed, Engine]
        BUILDING_SENSOR[Building Sensors<br/>Smoke Detectors, Sprinklers]
        HYDRANT[Smart Hydrants<br/>Water Pressure, Status]
        ENV_SENSOR[Environmental Sensors<br/>Temperature, Humidity, Wind Speed]
    end

    subgraph Edge["Edge Computing Layer"]
        GATEWAY[IoT Gateway<br/>Data Aggregation & Filtering]
        EDGE_PROC[Edge Processing<br/>Real-time Analysis]
        LOCAL_CACHE[Local Cache<br/>Offline Support]
    end

    subgraph Transport["Transport Layer"]
        MQTT[MQTT Broker<br/>Lightweight Messaging]
        LORAWAN[LoRaWAN Gateway<br/>Long-range Communication]
        CELLULAR[Cellular Communication<br/>4G/5G]
    end

    subgraph Cloud["Cloud Processing Layer"]
        IOT_HUB[IoT Hub<br/>Device Management]
        STREAM[Stream Processing<br/>Apache Kafka]
        RULES[Rules Engine<br/>Threshold Detection]
        ALERT[Alert Engine<br/>Notification Generation]
    end

    subgraph Storage["Storage Layer"]
        TSDB[(Time-series DB<br/>InfluxDB/TimescaleDB)]
        POSTGRES[(Main DB<br/>PostgreSQL)]
        S3[Object Storage<br/>Raw Data Archive]
    end

    subgraph Analytics["Analytics & Visualization Layer"]
        REALTIME_DASH[Real-time<br/>Dashboard]
        ML_INFERENCE[ML Inference<br/>Anomaly Detection]
        HISTORICAL[Historical Analysis<br/>Trend Visualization]
    end

    %% Devices to Edge
    WEARABLE -->|Bluetooth| GATEWAY
    VEHICLE_SENSOR -->|CAN Bus| GATEWAY
    BUILDING_SENSOR -->|LoRaWAN| LORAWAN
    HYDRANT -->|LoRaWAN| LORAWAN
    ENV_SENSOR -->|4G/5G| CELLULAR

    %% Edge Processing
    GATEWAY --> EDGE_PROC
    LORAWAN --> EDGE_PROC
    CELLULAR --> EDGE_PROC
    EDGE_PROC --> LOCAL_CACHE

    %% To Transport Layer
    EDGE_PROC -->|MQTT| MQTT
    LOCAL_CACHE -.Offline Mode.-> LOCAL_CACHE
    LOCAL_CACHE -.Online Recovery.-> MQTT

    %% Cloud Processing
    MQTT --> IOT_HUB
    IOT_HUB --> STREAM
    STREAM --> RULES
    RULES --> ALERT

    %% Data Storage
    STREAM -->|Time-series Data| TSDB
    STREAM -->|Metadata| POSTGRES
    STREAM -->|Raw Data| S3

    %% Analytics & Visualization
    TSDB --> REALTIME_DASH
    TSDB --> ML_INFERENCE
    TSDB --> HISTORICAL
    
    ALERT --> REALTIME_DASH
    ML_INFERENCE --> ALERT

    %% Styling
    style Field fill:#fecaca
    style Edge fill:#fed7aa
    style Transport fill:#fde68a
    style Cloud fill:#a7f3d0
    style Storage fill:#a5b4fc
    style Analytics fill:#e9d5ff
```

### IoT Data Processing Detailed Sequence

```mermaid
sequenceDiagram
    participant Device as IoT Device<br/>(Wearable)
    participant Gateway as IoT Gateway
    participant MQTT as MQTT Broker
    participant Stream as Stream Processing<br/>(Kafka)
    participant Rules as Rules Engine
    participant TSDB as Time-series DB<br/>(InfluxDB)
    participant Alert as Alert System
    participant Dashboard as Dashboard

    Note over Device,Dashboard: Real-time Data Streaming (1-second intervals)

    loop Continuous Monitoring
        Device->>Device: Sensor Reading<br/>{heart rate, temperature, SpO2, location}
        
        Device->>Gateway: Data Transmission (Bluetooth)<br/>JSON: {deviceId, timestamp, metrics}
        activate Gateway
        
        Gateway->>Gateway: Data Validation & Normalization<br/>- Range check<br/>- Missing value imputation
        
        Gateway->>MQTT: Publish<br/>Topic: sensors/wearable/{deviceId}
        activate MQTT
        deactivate Gateway
        
        MQTT->>Stream: Message Delivery
        activate Stream
        deactivate MQTT
        
        Stream->>Stream: Stream Processing<br/>- Window aggregation (5 sec)<br/>- Moving average calculation
        
        par Parallel Processing
            Stream->>TSDB: Save Time-series Data<br/>High-speed Write
            activate TSDB
            TSDB->>TSDB: Data Compression & Indexing
            deactivate TSDB
        and
            Stream->>Rules: Rule Evaluation
            activate Rules
            
            Rules->>Rules: Threshold Check<br/>Heart Rate > 180 bpm?<br/>Temperature > 39°C?<br/>SpO2 < 90%?
            
            alt Anomaly Detected
                Rules->>Alert: Generate Alert<br/>{level: CRITICAL, message, deviceId}
                activate Alert
                
                Alert->>Dashboard: 🚨 Emergency Notification Push<br/>WebSocket
                activate Dashboard
                Dashboard->>Dashboard: Warning Sound & Screen Flash
                deactivate Dashboard
                
                Alert->>Alert: Send SMS/Email<br/>→ Dispatcher
                deactivate Alert
                
                Rules->>TSDB: Record Alert Event
            end
            deactivate Rules
        and
            Stream->>Dashboard: Real-time Update<br/>WebSocket
            Dashboard->>Dashboard: Update Graphs & Meters
        end
        
        deactivate Stream
    end

    Note over Device,Dashboard: Data Retention Policy<br/>- Raw data: 7 days<br/>- Aggregated (1 min): 30 days<br/>- Aggregated (1 hour): 1 year
```

---

## 8. Mobile App Data Synchronization Flow

```mermaid
sequenceDiagram
    participant Mobile as Mobile App
    participant LocalDB as Local DB<br/>(SQLite)
    participant SyncService as Sync Service
    participant API as REST API
    participant CloudDB as Cloud DB<br/>(PostgreSQL)
    participant Storage as Cloud Storage<br/>(S3)

    Note over Mobile,Storage: Offline Operation

    Mobile->>LocalDB: Write Data<br/>(Local First)
    activate LocalDB
    LocalDB->>LocalDB: Add to Sync Queue<br/>sync_status = 'pending'
    deactivate LocalDB

    Mobile->>LocalDB: Save Photos & Videos<br/>(Local Storage)
    activate LocalDB
    LocalDB->>LocalDB: Add to Media Queue<br/>upload_status = 'pending'
    deactivate LocalDB

    Note over Mobile,Storage: Auto-sync When Online

    Mobile->>SyncService: Network Detected<br/>Start Sync
    activate SyncService

    SyncService->>LocalDB: Get Pending Sync Data<br/>WHERE sync_status = 'pending'
    activate LocalDB
    LocalDB-->>SyncService: Sync Target List<br/>[record1, record2, ...]
    deactivate LocalDB

    Note over Mobile,Storage: Conflict Resolution Strategy

    loop Each Record
        SyncService->>API: Upload Data<br/>POST /api/sync
        activate API
        
        API->>CloudDB: Check Timestamp<br/>Conflict Detection
        activate CloudDB
        
        alt No Conflict
            CloudDB->>CloudDB: Insert/Update Data
            CloudDB-->>API: Success Response<br/>{status: 'ok', serverId}
        else Conflict (Server is newer)
            CloudDB-->>API: Conflict Response<br/>{status: 'conflict', serverData}
            API->>SyncService: Server Data Wins<br/>Overwrite Client
            SyncService->>LocalDB: Update Local Data
        end
        deactivate CloudDB
        
        API-->>SyncService: Sync Result
        deactivate API
        
        SyncService->>LocalDB: sync_status = 'synced'<br/>Save server_id
    end

    Note over Mobile,Storage: Media File Synchronization

    SyncService->>LocalDB: Get Unuploaded Media
    activate LocalDB
    LocalDB-->>SyncService: Media File List
    deactivate LocalDB

    loop Each Media File
        SyncService->>SyncService: Image Compression & Optimization<br/>JPEG quality 80%, Resize
        
        SyncService->>API: Multipart Upload<br/>POST /api/media/upload
        activate API
        
        API->>Storage: S3 Upload<br/>Using presigned URL
        activate Storage
        Storage-->>API: Upload Complete<br/>{fileUrl, fileId}
        deactivate Storage
        
        API->>CloudDB: Save Media Metadata<br/>{fileId, url, recordId}
        activate CloudDB
        CloudDB-->>API: Save Complete
        deactivate CloudDB
        
        API-->>SyncService: Upload Success
        deactivate API
        
        SyncService->>LocalDB: upload_status = 'uploaded'<br/>Save file_url
        activate LocalDB
        
        alt Storage Space Recovery Needed
            LocalDB->>LocalDB: Delete Local File<br/>(After cloud confirmation)
        end
        deactivate LocalDB
    end

    Note over Mobile,Storage: Download Delta from Server

    SyncService->>API: Request Delta Data<br/>GET /api/sync/delta?since={lastSyncTime}
    activate API
    
    API->>CloudDB: Delta Query<br/>WHERE updated_at > lastSyncTime
    activate CloudDB
    CloudDB-->>API: Updated Data List
    deactivate CloudDB
    
    API-->>SyncService: Return Delta Data<br/>[newRecord1, updatedRecord2, ...]
    deactivate API

    SyncService->>LocalDB: Update Local DB<br/>INSERT/UPDATE
    activate LocalDB
    LocalDB->>LocalDB: Record Last Sync Time<br/>last_sync_time = now()
    deactivate LocalDB

    SyncService->>Mobile: Sync Complete Notification<br/>{synced: 15, conflicts: 0}
    deactivate SyncService

    Mobile->>Mobile: Update UI & Display Notification<br/>"Sync Complete: 15 items"

    Note over Mobile,Storage: Sync Status Persistence<br/>Used for delta sync on next startup
```

---

## Data Flow Summary

### Primary Data Paths

| Data Type | Origin | Processing Method | Storage | Real-time |
|----------|--------|---------|--------|--------------|
| **Emergency Call Data** | 112/911 Center | REST API → Dispatch Service | PostgreSQL | < 1 second |
| **GPS Location** | Fire Vehicles | WebSocket → Redis → DB | Redis + PostgreSQL | 5-second intervals |
| **Vital Signs** | Wearables | MQTT → Kafka → Time-series DB | InfluxDB | 1-second intervals |
| **Scene Photos & Videos** | Mobile App | Multipart → S3 | S3 + Metadata DB | Asynchronous |
| **Inspection Checklist** | Inspector App | Offline → Sync | SQLite → PostgreSQL | Batch Sync |
| **Analytics Reports** | Data Warehouse | ETL Batch | Data Warehouse | Daily Batch |

### Data Retention Policy

| Data Type | Retention Period | Archival Strategy |
|----------|---------|--------------|
| **Incident Records** | Permanent | Move to cold storage after 5 years |
| **GPS Location History (Raw)** | 90 days | Convert to 1-minute aggregates |
| **Vital Signs (Raw)** | 7 days | Convert to 5-minute aggregates |
| **Media Files** | Permanent | Compress & archive after 1 year |
| **Application Logs** | 30 days | Permanent storage for critical logs only |
| **Analytics Aggregates** | Permanent | Annual archival |

---

## Summary

This document provides detailed explanations of 8 major data flows in the FMS system:

1. **Emergency Call to Dispatch** - End-to-end dispatch process
2. **On-Scene Operations** - Real-time activity recording and safety monitoring
3. **Cross-System Integration** - Data exchange with external systems
4. **Real-time Data** - WebSocket-based bi-directional communication
5. **Analytics & Reporting** - ETL pipeline and BI
6. **Inspection & Prevention** - Digital inspection workflow
7. **IoT Sensors** - Edge-to-cloud IoT data processing
8. **Mobile Synchronization** - Offline support and conflict resolution

These data flows form the foundation for FMS to function as a **high-speed, highly reliable, and scalable** system.
