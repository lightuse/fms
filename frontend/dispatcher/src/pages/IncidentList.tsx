import React, { useState } from 'react'
import IncidentDetail from '../components/IncidentDetail'

type Incident = { id: number; title: string; time: string; location: string; priority?: string; status?: string; summary?: string }

const mockIncidents: Incident[] = [
  { id: 1, title: '火災 - 建物', time: '2026-02-13T10:00:00Z', location: '35.0,135.0', priority: 'high', status: 'open', summary: '建物の2階から煙が出ているとの通報' },
  { id: 2, title: '救急 - 人', time: '2026-02-13T10:05:00Z', location: '35.1,135.1', priority: 'medium', status: 'open', summary: '倒れている人がいるとの通報' }
]

export default function IncidentList() {
  const [selected, setSelected] = useState<Incident | null>(null)

  return (
    <div className="incident-list">
      <h2>Incidents</h2>
      <ul>
        {mockIncidents.map(i => (
          <li key={i.id} onClick={() => setSelected(i)} className="incident-row" role="button" tabIndex={0}>
            <strong>{i.title}</strong>
            <div className="meta">{new Date(i.time).toLocaleString()} • {i.priority}</div>
            <div className="location">{i.location}</div>
          </li>
        ))}
      </ul>

      {selected && (
        <IncidentDetail incident={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
