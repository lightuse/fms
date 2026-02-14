import React, { useState } from 'react'
import IncidentDetail from '../components/IncidentDetail'

type Incident = { id: number; title: string; time: string; location: string; priority?: string; status?: string; summary?: string }

const mockIncidents: Incident[] = [
  { id: 1, title: 'Building Fire', time: '2026-02-13T10:00:00Z', location: '0.5,20.5', priority: 'high', status: 'open', summary: 'Report of smoke on second floor of a building' },
  { id: 2, title: 'Medical Emergency', time: '2026-02-13T10:05:00Z', location: '1.0,21.0', priority: 'medium', status: 'open', summary: 'Person reported collapsed' }
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
