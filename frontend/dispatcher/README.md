# Dispatcher Frontend (Vite + React)

Quick scaffold for the Dispatcher MVP using Vite + React + Leaflet + Socket.IO client.

Quickstart

1. cd frontend/dispatcher
2. npm install
3. npm run dev

Environment

1. Copy `.env.example` to `.env.local` and update values as needed:

```bash
cp .env.example .env.local
```

2. Key variables available at runtime via `import.meta.env`:
- `VITE_API_BASE_URL` — base path for backend API (default `/api`)
- `VITE_WS_ENDPOINT` — websocket endpoint (default `/ws`)
- `VITE_SOCKET_PATH` — Socket.IO path (default `/socket.io`)
- `VITE_MAP_TILE_URL` — tile URL template for maps

Note: Do NOT commit `.env.local` — it is ignored by `.gitignore`.
