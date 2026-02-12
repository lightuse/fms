# Implementation Plan — フロントエンド作成 (001-create-frontend)

## 概要
スタック: React + Vite、Leaflet(OpenStreetMap)、Socket.IO クライアント、TypeScript、PWA 対応（段階的）。

## フェーズ

1. Phase 0 — 設計 (2 days)
   - API 契約（エンドポイント、レスポンススキーマ）を定義
   - 高レベル UI ワイヤーフレーム（インシデント一覧・詳細、ユニット地図、割当モーダル）
2. Phase 1 — MVP 実装 (5 days)
   - プロジェクト scaffold (Vite + React + TypeScript)
   - インシデント一覧ページ、詳細ページの実装（モック API 経由）
   - ユニット地図ビュー（Leaflet）とサンプルピン表示
   - Socket.IO クライアント実装（モック・接続検証）
3. Phase 2 — 統合と信頼性 (3 days)
   - 本番 API 連携、認証セッション統合
   - 割当 UI と API 呼び出し（トランザクション的取り扱い）
   - リアルタイム競合・再試行ロジックの追加
4. Phase 3 — QA とデプロイ準備 (2 days)
   - ユニット/統合テスト、E2E（簡易）
   - PWA マニフェスト、CI ワークフロー、README と quickstart

## 主要成果物
- `frontend/dispatcher/` の初期リポジトリ（Vite React）
- `specs/001-create-frontend/contracts/openapi.yaml` （API 要求が出た場合）
- `specs/001-create-frontend/quickstart.md`（実行手順）

## 具体タスク（短期優先）
- T1: API エンドポイント一覧を確定（incidents, units, dispatch）
- T2: Scaffolding を作成（`frontend/dispatcher/`）
- T3: Incident list と mock data での表示確認
- T4: Unit map を Leaflet で実装、モック GPS を流す
- T5: Socket.IO client を接続し、UI で更新を確認

## 見積り
- 合計: 約12 労働日（設計 2d + MVP 5d + 統合 3d + QA 2d）

## リスク & 前提
- バックエンド API のスキーマが不確定 → 早めに契約（OpenAPI）を合意する必要あり
- 認証方式（既存）に合わせたトークン取得・リフレッシュが必要

---

作業を進めてよければ、次に `frontend/dispatcher` の scaffold を作成します。
