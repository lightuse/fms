import React from 'react';

const FMSArchitecture = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            統合火災管理システム (FMS)
          </h1>
          <p className="text-slate-600">システムアーキテクチャ概要図</p>
        </div>

        <div className="space-y-6">
          {/* User Layer */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
              <span className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">1</span>
              ユーザー層
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { name: '消防指揮官', icon: '👨‍🚒' },
                { name: '消防隊員', icon: '🚒' },
                { name: '通信指令員', icon: '📞' },
                { name: '査察員', icon: '📋' },
                { name: '一般市民', icon: '👥' }
              ].map((user, idx) => (
                <div key={idx} className="bg-blue-50 rounded p-3 text-center border border-blue-200">
                  <div className="text-2xl mb-1">{user.icon}</div>
                  <div className="text-xs font-medium text-slate-700">{user.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Presentation Layer */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center">
              <span className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">2</span>
              プレゼンテーション層
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-bold text-green-800 mb-2">🌐 Webアプリケーション</h3>
                <p className="text-sm text-slate-600 mb-2">React.js / Next.js</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• 指令センターダッシュボード</li>
                  <li>• 分析レポート画面</li>
                  <li>• 管理者コンソール</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-bold text-green-800 mb-2">📱 モバイルアプリ</h3>
                <p className="text-sm text-slate-600 mb-2">Flutter / React Native</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• 現場隊員用アプリ</li>
                  <li>• 査察デジタルチェックリスト</li>
                  <li>• オフライン対応機能</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-bold text-green-800 mb-2">🖥️ デスクトップ</h3>
                <p className="text-sm text-slate-600 mb-2">Progressive Web App</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• 指令台専用UI</li>
                  <li>• GISマッピング画面</li>
                  <li>• リアルタイム監視</li>
                </ul>
              </div>
            </div>
          </div>

          {/* API Gateway & Security */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
              <span className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">3</span>
              APIゲートウェイ & セキュリティ層
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="bg-purple-50 rounded p-3 border border-purple-200 text-center">
                <div className="text-lg mb-1">🔐</div>
                <div className="font-semibold text-sm text-purple-800">認証・認可</div>
                <div className="text-xs text-slate-600">Keycloak SSO</div>
              </div>
              <div className="bg-purple-50 rounded p-3 border border-purple-200 text-center">
                <div className="text-lg mb-1">🛡️</div>
                <div className="font-semibold text-sm text-purple-800">暗号化通信</div>
                <div className="text-xs text-slate-600">TLS 1.3 / AES-256</div>
              </div>
              <div className="bg-purple-50 rounded p-3 border border-purple-200 text-center">
                <div className="text-lg mb-1">⚡</div>
                <div className="font-semibold text-sm text-purple-800">APIゲートウェイ</div>
                <div className="text-xs text-slate-600">負荷分散・ルーティング</div>
              </div>
              <div className="bg-purple-50 rounded p-3 border border-purple-200 text-center">
                <div className="text-lg mb-1">🔍</div>
                <div className="font-semibold text-sm text-purple-800">監査ログ</div>
                <div className="text-xs text-slate-600">全操作記録</div>
              </div>
            </div>
          </div>

          {/* Application Layer - Core Modules */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <h2 className="text-xl font-bold text-orange-700 mb-4 flex items-center">
              <span className="bg-orange-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">4</span>
              アプリケーション層 - コアモジュール
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: '🚨 緊急通報・出動管理',
                  tech: 'Node.js / NestJS',
                  features: ['112/911統合', 'GPS位置特定', '自動出動指示', 'リアルタイム追跡']
                },
                {
                  title: '🗺️ 現場指揮管理',
                  tech: 'GIS Engine',
                  features: ['地図可視化', '部隊配置', '消火栓マッピング', '複数機関連携']
                },
                {
                  title: '🚒 資産・車両管理',
                  tech: 'Spring Boot',
                  features: ['車両追跡', '在庫管理', 'メンテナンス', '燃料監視']
                },
                {
                  title: '👥 人員・安全管理',
                  tech: 'NestJS',
                  features: ['シフト管理', '資格追跡', '健康モニタリング', '現場所在確認']
                },
                {
                  title: '🔥 火災予防・査察',
                  tech: 'Node.js',
                  features: ['査察スケジュール', 'デジタルチェック', '違反追跡', '教育記録']
                },
                {
                  title: '📊 分析・インテリジェンス',
                  tech: 'Python / FastAPI',
                  features: ['KPIダッシュボード', 'ヒートマップ', '傾向分析', 'AI予測']
                }
              ].map((module, idx) => (
                <div key={idx} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h3 className="font-bold text-orange-800 mb-1">{module.title}</h3>
                  <p className="text-xs text-slate-500 mb-2 font-mono">{module.tech}</p>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {module.features.map((feature, fidx) => (
                      <li key={fidx}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Business Logic Layer */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-cyan-500">
            <h2 className="text-xl font-bold text-cyan-700 mb-4 flex items-center">
              <span className="bg-cyan-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">5</span>
              ビジネスロジック層
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <h3 className="font-bold text-cyan-800 mb-2">⚙️ ワークフローエンジン</h3>
                <p className="text-sm text-slate-600 mb-2">Camunda / Temporal</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• 出動フロー自動化</li>
                  <li>• 承認プロセス管理</li>
                  <li>• 複雑な業務ロジック</li>
                </ul>
              </div>
              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <h3 className="font-bold text-cyan-800 mb-2">🔔 通知・アラート</h3>
                <p className="text-sm text-slate-600 mb-2">Message Queue</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• SMS/Email/Push通知</li>
                  <li>• リアルタイムアラート</li>
                  <li>• エスカレーション管理</li>
                </ul>
              </div>
              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <h3 className="font-bold text-cyan-800 mb-2">🧮 ルールエンジン</h3>
                <p className="text-sm text-slate-600 mb-2">Business Rules</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• 出動基準判定</li>
                  <li>• リスク評価</li>
                  <li>• 規制コンプライアンス</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Layer */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <h2 className="text-xl font-bold text-red-700 mb-4 flex items-center">
              <span className="bg-red-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">6</span>
              データ層
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="bg-red-50 rounded p-3 border border-red-200">
                <div className="font-semibold text-sm text-red-800 mb-1">🗄️ メインDB</div>
                <div className="text-xs text-slate-600 mb-2 font-mono">PostgreSQL + PostGIS</div>
                <div className="text-xs text-slate-500">構造化データ・地理情報</div>
              </div>
              <div className="bg-red-50 rounded p-3 border border-red-200">
                <div className="font-semibold text-sm text-red-800 mb-1">⚡ キャッシュ</div>
                <div className="text-xs text-slate-600 mb-2 font-mono">Redis</div>
                <div className="text-xs text-slate-500">リアルタイム追跡・セッション</div>
              </div>
              <div className="bg-red-50 rounded p-3 border border-red-200">
                <div className="font-semibold text-sm text-red-800 mb-1">📁 ファイルストレージ</div>
                <div className="text-xs text-slate-600 mb-2 font-mono">S3 / MinIO</div>
                <div className="text-xs text-slate-500">写真・動画・文書</div>
              </div>
              <div className="bg-red-50 rounded p-3 border border-red-200">
                <div className="font-semibold text-sm text-red-800 mb-1">📈 分析DB</div>
                <div className="text-xs text-slate-600 mb-2 font-mono">Data Warehouse</div>
                <div className="text-xs text-slate-500">BI・レポーティング</div>
              </div>
            </div>
          </div>

          {/* Integration Layer */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
            <h2 className="text-xl font-bold text-indigo-700 mb-4 flex items-center">
              <span className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">7</span>
              統合・連携層
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { name: 'GISシステム', icon: '🗺️', detail: 'ArcGIS/OSM' },
                { name: 'IoTセンサー', icon: '📡', detail: 'MQTT/LoRaWAN' },
                { name: '警察システム', icon: '👮', detail: 'API連携' },
                { name: '医療サービス', icon: '🚑', detail: 'EMS統合' },
                { name: '気象情報', icon: '🌤️', detail: 'API/RSS' }
              ].map((integration, idx) => (
                <div key={idx} className="bg-indigo-50 rounded p-3 border border-indigo-200 text-center">
                  <div className="text-2xl mb-1">{integration.icon}</div>
                  <div className="text-xs font-medium text-slate-700">{integration.name}</div>
                  <div className="text-xs text-slate-500">{integration.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure Layer */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-slate-500">
            <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center">
              <span className="bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">8</span>
              インフラストラクチャ層
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2">☁️ クラウド基盤</h3>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• 高可用性: 99.99% SLA</li>
                  <li>• 自動スケーリング</li>
                  <li>• マルチリージョン対応</li>
                  <li>• 災害復旧(DR)</li>
                </ul>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2">🐳 コンテナ管理</h3>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Kubernetes オーケストレーション</li>
                  <li>• Docker コンテナ化</li>
                  <li>• CI/CD パイプライン</li>
                  <li>• サービスメッシュ</li>
                </ul>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2">📊 監視・ログ</h3>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• リアルタイム監視</li>
                  <li>• アラート管理</li>
                  <li>• ログ集約・分析</li>
                  <li>• パフォーマンス最適化</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg shadow-md p-6 border border-amber-200">
            <h2 className="text-xl font-bold text-amber-800 mb-4">✨ システムの主要特徴</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="text-amber-600 mr-2">🔧</div>
                  <div>
                    <div className="font-semibold text-sm text-slate-800">モジュール式設計</div>
                    <div className="text-xs text-slate-600">必要な機能のみ選択・購入可能</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-amber-600 mr-2">🏷️</div>
                  <div>
                    <div className="font-semibold text-sm text-slate-800">ホワイトラベル対応</div>
                    <div className="text-xs text-slate-600">組織ブランディングのカスタマイズ</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="text-amber-600 mr-2">🔌</div>
                  <div>
                    <div className="font-semibold text-sm text-slate-800">API優先設計</div>
                    <div className="text-xs text-slate-600">他システムとの連携が容易</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-amber-600 mr-2">📴</div>
                  <div>
                    <div className="font-semibold text-sm text-slate-800">オフライン機能</div>
                    <div className="text-xs text-slate-600">災害時も継続稼働</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="text-amber-600 mr-2">🌍</div>
                  <div>
                    <div className="font-semibold text-sm text-slate-800">マルチテナント</div>
                    <div className="text-xs text-slate-600">複数組織の安全なデータ分離</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-amber-600 mr-2">📈</div>
                  <div>
                    <div className="font-semibold text-sm text-slate-800">スケーラブル</div>
                    <div className="text-xs text-slate-600">小規模から国家規模まで対応</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>統合火災管理システム (Integrated Fire Management System) - アーキテクチャ概要</p>
        </div>
      </div>
    </div>
  );
};

export default FMSArchitecture;