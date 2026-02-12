import React from 'react'

const mockIncidents = [
  { id: 1, title: '火災 - 建物', time: '2026-02-13T10:00:00Z', location: '35.0,135.0' },
  { id: 2, title: '救急 - 人', time: '2026-02-13T10:05:00Z', location: '35.1,135.1' }
]

export default function IncidentList() {
  return (
    <div className="incident-list">
      <h2>Incidents</h2>
      <ul>
        {mockIncidents.map(i => (
          <li key={i.id}>
            <strong>{i.title}</strong>
            <div>{new Date(i.time).toLocaleString()}</div>
            <div>{i.location}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
