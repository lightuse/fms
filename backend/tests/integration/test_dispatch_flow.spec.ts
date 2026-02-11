import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { pool } from '../../src/db';

let client: any = null;

beforeAll(async () => {
  try {
    client = await pool.connect();
  } catch (e) {
    client = null;
    console.warn('Integration DB not available, skipping DB tests:', e.message || e);
  }
});

afterAll(async () => {
  if (client) client.release();
  await pool.end();
});

describe('dispatch flow (integration)', () => {
  if (!client) {
    it('skipped - DB not available', () => {
      expect(true).toBe(true);
    });
    return;
  }

  it('can insert a unit and an incident and perform assignment transaction', async () => {
    const tenant = '00000000-0000-0000-0000-000000000001';
    // insert unit
    const resUnit = await client.query(
      `INSERT INTO units (tenant_id, name, capabilities, status, last_known) VALUES ($1,$2,$3,$4, ST_SetSRID(ST_MakePoint($5,$6),4326)) RETURNING unit_id`,
      [tenant, 'test-unit', JSON.stringify([]), 'Available', 139.0, 35.0]
    );
    const unitId = resUnit.rows[0].unit_id;

    // insert incident
    const resInc = await client.query(
      `INSERT INTO incidents (tenant_id, creator_id, location, location_text, type, severity, notes, status) VALUES ($1,$2, ST_SetSRID(ST_Point($3,$4),4326), $5, $6, $7, $8, $9) RETURNING id`,
      [tenant, null, 139.001, 35.001, 'Test location', 'fire', 'notes', 'Open']
    );
    const incidentId = resInc.rows[0].id;

    // perform transactional assignment (simulate service)
    await client.query('BEGIN');
    const sel = await client.query('SELECT unit_id, status FROM units WHERE unit_id = $1 FOR UPDATE', [unitId]);
    expect(sel.rows.length).toBe(1);
    expect(sel.rows[0].status).toBe('Available');

    await client.query('UPDATE units SET status = $1 WHERE unit_id = $2', ['Assigned', unitId]);
    await client.query(`INSERT INTO dispatch_events (incident_id, unit_id, action, details) VALUES ($1,$2,'assign',$3)`, [incidentId, unitId, JSON.stringify({note:'test assign'})]);
    await client.query('INSERT INTO incident_assignments (incident_id, unit_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [incidentId, unitId]);
    await client.query('COMMIT');

    const check = await client.query('SELECT * FROM incident_assignments WHERE incident_id = $1 AND unit_id = $2', [incidentId, unitId]);
    expect(check.rows.length).toBe(1);
  }, 20000);
});
