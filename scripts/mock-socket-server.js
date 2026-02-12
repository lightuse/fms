#!/usr/bin/env node
/*
  Simple mock Socket.IO server to emit unit position updates for local testing.
  Usage: node scripts/mock-socket-server.js
*/
const http = require('http')
const { Server } = require('socket.io')

const PORT = process.env.MOCK_SOCKET_PORT || 4000

const server = http.createServer((req, res) => {
  res.writeHead(200)
  res.end('mock socket server')
})

const io = new Server(server, {
  path: process.env.MOCK_SOCKET_PATH || '/socket.io',
  cors: { origin: '*' }
})

let units = [
  { id: 'u1', name: 'Unit 1', lat: 35.0, lng: 135.0 },
  { id: 'u2', name: 'Unit 2', lat: 35.1, lng: 135.1 }
]

io.on('connection', socket => {
  console.log('client connected', socket.id)

  // send initial list
  socket.emit('units:init', units)

  socket.on('units:subscribe', () => {
    console.log('subscribe from', socket.id)
    socket.emit('units:init', units)
  })

  socket.on('disconnect', () => {
    console.log('client disconnected', socket.id)
  })
})

// Periodically nudge units and emit updates
setInterval(() => {
  units = units.map(u => {
    const deltaLat = (Math.random() - 0.5) * 0.002
    const deltaLng = (Math.random() - 0.5) * 0.002
    const updated = { ...u, lat: +(u.lat + deltaLat).toFixed(6), lng: +(u.lng + deltaLng).toFixed(6) }
    // broadcast single unit update
    io.emit('unit:update', updated)
    return updated
  })
}, 5000)

server.listen(PORT, () => console.log(`Mock Socket.IO server listening on http://localhost:${PORT}`))
