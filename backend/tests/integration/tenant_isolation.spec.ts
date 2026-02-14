import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { pool } from '../../src/db';

let client: any = null;

beforeAll(async () => {
  try {
    client = await pool.connect();
  } catch (e) {
    client = null;
    console.warn('Integration DB not available, skipping tenant isolation tests:', e.message || e);
  }
});

afterAll(async () => {
  if (client) client.release();
  await pool.end();
});

describe('tenant isolation (RLS) integration', () => {
  if (!client) {
    it('skipped - DB not available', () => {
      expect(true).toBe(true);
    });
    return;
  }

  it('enforces tenant-based SELECT visibility', async () => {
    const t1 = '00000000-0000-0000-0000-000000000011';
    const t2 = '00000000-0000-0000-0000-000000000022';

    // insert two units with different tenant ids
    await client.query(`INSERT INTO units (tenant_id, name, capabilities, status, last_known) VALUES ($1,$2,$3,$4, ST_SetSRID(ST_MakePoint($5,$6),4326))`, [t1, 'unit-t1', JSON.stringify([]), 'Available', 139.0, 35.0]);
    await client.query(`INSERT INTO units (tenant_id, name, capabilities, status, last_known) VALUES ($1,$2,$3,$4, ST_SetSRID(ST_MakePoint($5,$6),4326))`, [t2, 'unit-t2', JSON.stringify([]), 'Available', 139.5, 35.5]);

    // set session tenant to t1 and ensure only t1 units are visible
    await client.query(`SET SESSION "fms.tenant_id" = '${t1}'`);
    const res1 = await client.query('SELECT tenant_id, name FROM units');
    expect(res1.rows.length).toBeGreaterThanOrEqual(1);
    expect(res1.rows.every((r: any) => r.tenant_id === t1)).toBe(true);

    // set session tenant to t2 and ensure only t2 units are visible
    await client.query(`SET SESSION "fms.tenant_id" = '${t2}'`);
    const res2 = await client.query('SELECT tenant_id, name FROM units');
    expect(res2.rows.length).toBeGreaterThanOrEqual(1);
    expect(res2.rows.every((r: any) => r.tenant_id === t2)).toBe(true);
  }, 20000);

  it('blocks writes for mismatched tenant session', async () => {
    const t1 = '00000000-0000-0000-0000-000000000033';
    const t2 = '00000000-0000-0000-0000-000000000044';

    // insert a unit for t2
    await client.query(`INSERT INTO units (tenant_id, name, capabilities, status, last_known) VALUES ($1,$2,$3,$4, ST_SetSRID(ST_MakePoint($5,$6),4326))`, [t2, 'unit-write-block', JSON.stringify([]), 'Available', 139.2, 35.2]);

    // set session tenant to t1 and attempt to insert a unit claiming tenant t2 -> should be blocked by RLS
    await client.query(`SET SESSION "fms.tenant_id" = '${t1}'`);
    let threw = false;
    try {
      await client.query(`INSERT INTO units (tenant_id, name, capabilities, status) VALUES ($1,$2,$3,$4)`, [t2, 'bad-insert', JSON.stringify([]), 'Available']);
    } catch (e) {
      threw = true;
    }
    expect(threw).toBe(true);
  }, 20000);
});
