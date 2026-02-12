import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const units = [
  { id: 'u1', name: 'Unit 1', lat: 35.0, lng: 135.0 },
  { id: 'u2', name: 'Unit 2', lat: 35.1, lng: 135.1 }
]

export default function UnitMap() {
  useEffect(() => {
    // placeholder for Socket.IO connection initialization later
  }, [])

  return (
    <div className="unit-map">
      <h2>Units</h2>
      <MapContainer center={[35.05, 135.05]} zoom={11} style={{ height: '400px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {units.map(u => (
          <Marker key={u.id} position={[u.lat, u.lng]}>
            <Popup>{u.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
