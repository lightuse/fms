import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { io, Socket } from 'socket.io-client'
import UnitDetail from '../components/UnitDetail'

type Unit = { id: string; name: string; lat: number; lng: number }

const initialUnits: Unit[] = [
  { id: 'u1', name: 'Unit 1', lat: 0.5, lng: 20.5 },
  { id: 'u2', name: 'Unit 2', lat: 1.0, lng: 21.0 }
]

export default function UnitMap() {
  const [units, setUnits] = useState<Unit[]>(initialUnits)
  const [connected, setConnected] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)

  useEffect(() => {
    const wsEndpoint = (import.meta.env.VITE_WS_ENDPOINT as string) || '/ws'
    const socketPath = (import.meta.env.VITE_SOCKET_PATH as string) || '/socket.io'

    // Resolve relative endpoint to absolute URL when necessary
    const url = wsEndpoint.startsWith('http')
      ? wsEndpoint
      : `${location.protocol}//${location.host}${wsEndpoint}`

    const socket: Socket = io(url, { path: socketPath, transports: ['websocket'], autoConnect: true })

    socket.on('connect', () => {
      setConnected(true)
      console.debug('socket connected', socket.id)
      // Optionally request initial state
      socket.emit('units:subscribe')
    })

    socket.on('disconnect', () => {
      setConnected(false)
    })

    socket.on('unit:update', (u: Unit) => {
      setUnits(prev => {
        const found = prev.find(p => p.id === u.id)
        if (found) {
          return prev.map(p => (p.id === u.id ? { ...p, lat: u.lat, lng: u.lng } : p))
        }
        return [...prev, u]
      })
    })

    socket.on('units:init', (list: Unit[]) => {
      setUnits(list)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

    return (
    <div className="unit-map">
      <h2>Units {connected ? '(live)' : '(disconnected)'}</h2>
      <MapContainer center={[0, 20]} zoom={4} style={{ height: '400px' }}>
        <TileLayer url={(import.meta.env.VITE_MAP_TILE_URL as string) || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'} />
        {units.map(u => (
          <Marker key={u.id} position={[u.lat, u.lng]} eventHandlers={{ click: () => setSelectedUnit(u) }}>
            <Popup>{u.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {selectedUnit && (
        <UnitDetail unit={selectedUnit} onClose={() => setSelectedUnit(null)} onAssign={() => {
          // placeholder: emit assign action to socket or open dispatch flow
          // In future: open assignment modal and call POST /dispatch
          console.log('Assign requested for', selectedUnit.id)
        }} />
      )}
    </div>
  )
}
