import React, { useEffect, useState } from 'react'
import { fetchUnits, assignUnit } from '../lib/api'

type Unit = { id: string; name: string; lat?: number; lng?: number; status?: string }

export default function DispatchModal({ incidentId, onClose, onAssigned }: { incidentId: number | string; onClose: () => void; onAssigned?: (assignment: any) => void }) {
  const [units, setUnits] = useState<Unit[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    fetchUnits().then((data: any) => {
      if (!mounted) return
      setUnits(data.items || data)
    }).catch(err => {
      console.error(err)
      if (mounted) setError('Failed to load units')
    })
    return () => { mounted = false }
  }, [])

  async function doAssign() {
    if (!selected) return setError('Select a unit')
    setLoading(true)
    setError(null)
    try {
      const res = await assignUnit(incidentId, selected)
      onAssigned && onAssigned(res)
      onClose()
    } catch (e: any) {
      console.error(e)
      setError(e.message || 'Assign failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} role="dialog">
        <header className="modal-header">
          <h3>Assign Unit</h3>
          <button className="close" onClick={onClose}>×</button>
        </header>
        <div className="modal-body">
          {error && <div className="error">{error}</div>}
          <ul>
            {units.map(u => (
              <li key={u.id} className={`unit-row ${selected === u.id ? 'selected' : ''}`} onClick={() => setSelected(u.id)}>
                <strong>{u.name}</strong>
                <div className="meta">{u.status}</div>
              </li>
            ))}
          </ul>
        </div>
        <footer className="modal-footer">
          <button className="btn-primary" onClick={doAssign} disabled={loading}>{loading ? 'Assigning...' : 'Assign'}</button>
          <button onClick={onClose}>Cancel</button>
        </footer>
      </div>
    </div>
  )
}
