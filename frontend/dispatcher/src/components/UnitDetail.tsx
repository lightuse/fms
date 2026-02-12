import React from 'react'

type Unit = { id: string; name: string; lat: number; lng: number; status?: string; last_seen?: string }

export default function UnitDetail({ unit, onClose, onAssign }: { unit: Unit; onClose: () => void; onAssign?: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="modal-header">
          <h3>{unit.name}</h3>
          <button className="close" onClick={onClose}>×</button>
        </header>
        <div className="modal-body">
          <p><strong>ID:</strong> {unit.id}</p>
          <p><strong>Position:</strong> {unit.lat}, {unit.lng}</p>
          <p><strong>Status:</strong> {unit.status ?? 'unknown'}</p>
          <p><strong>Last seen:</strong> {unit.last_seen ?? '—'}</p>
        </div>
        <footer className="modal-footer">
          <button className="btn-primary" onClick={() => onAssign && onAssign()}>Assign to Incident</button>
          <button onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  )
}
