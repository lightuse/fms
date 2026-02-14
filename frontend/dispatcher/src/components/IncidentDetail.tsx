import React, { useState } from 'react'
import DispatchModal from './DispatchModal'

type Incident = { id: number; title: string; time: string; location: string; priority?: string; status?: string; summary?: string }

export default function IncidentDetail({ incident, onClose }: { incident: Incident; onClose: () => void }) {
  const [showDispatch, setShowDispatch] = useState(false)

  function handleAssigned(res: any) {
    console.log('assigned', res)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="modal-header">
          <h3>{incident.title}</h3>
          <button className="close" onClick={onClose}>×</button>
        </header>
        <div className="modal-body">
          <p><strong>ID:</strong> {incident.id}</p>
          <p><strong>Time:</strong> {new Date(incident.time).toLocaleString()}</p>
          <p><strong>Location:</strong> {incident.location}</p>
          <p><strong>Priority:</strong> {incident.priority}</p>
          <p><strong>Status:</strong> {incident.status}</p>
          <p><strong>Summary:</strong> {incident.summary}</p>
        </div>
        <footer className="modal-footer">
          <button className="btn-primary" onClick={() => setShowDispatch(true)}>Assign Unit</button>
          <button onClick={onClose}>Close</button>
        </footer>
      </div>
      {showDispatch && <DispatchModal incidentId={incident.id} onClose={() => setShowDispatch(false)} onAssigned={handleAssigned} />}
    </div>
  )
}
