import { Injectable } from '@nestjs/common';
import { pool } from '../db';

@Injectable()
export class UnitsService {
  async findNearby(lat: number, lon: number, radiusKm = 5) {
    const client = await pool.connect();
    try {
      const res = await client.query(
        `SELECT unit_id, name, status, ST_AsText(last_known) AS location_wkt,
                ST_DistanceSphere(ST_SetSRID(ST_MakePoint($1, $2), 4326), ST_SetSRID(last_known,4326)) AS distance_m
         FROM units
         WHERE ST_DWithin(last_known::geography, ST_SetSRID(ST_MakePoint($1, $2),4326)::geography, $3)
         AND status = 'Available'
         LIMIT 100`,
        [lon, lat, radiusKm * 1000]
      );
      return res.rows;
    } finally {
      client.release();
    }
  }

  async markAssigned(unitIds: string[], incidentId: string) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const id of unitIds) {
        await client.query(`UPDATE units SET status='Assigned' WHERE unit_id = $1`, [id]);
        await client.query(
          `INSERT INTO dispatch_events (incident_id, unit_id, action, details) VALUES ($1,$2,'assign', $3)`,
          [incidentId, id, JSON.stringify({ note: 'Assigned via API' })]
        );
        await client.query(
          `INSERT INTO incident_assignments (incident_id, unit_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
          [incidentId, id]
        );
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

export default UnitsService;
