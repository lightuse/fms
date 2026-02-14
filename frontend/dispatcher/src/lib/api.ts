export const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || '/api'

export async function fetchUnits() {
  const res = await fetch(`${API_BASE}/units`)
  if (!res.ok) throw new Error(`Failed to fetch units: ${res.status}`)
  return res.json()
}

export async function assignUnit(incidentId: number | string, unitId: string, assignedBy?: string) {
  const body = { incident_id: String(incidentId), unit_id: unitId }
  if (assignedBy) (body as any).assigned_by = assignedBy

  const res = await fetch(`${API_BASE}/dispatch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Assign failed: ${res.status} ${text}`)
  }

  return res.json()
}
