import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './incident.entity';
import { pool } from '../db';

@Injectable()
export class IncidentsService {
  constructor(@InjectRepository(Incident) private repo: Repository<Incident>) {}

  async list() {
    return this.repo
      .createQueryBuilder('i')
      .select(['i.id', 'i.location', 'i.location_text', 'i.type', 'i.severity', 'i.status', 'i.created_at'])
      .limit(100)
      .getMany();
  }

  async create(payload: any) {
    const loc = () => `ST_SetSRID(ST_Point(${payload.location.coordinates[0]}, ${payload.location.coordinates[1]}), 4326)`;
    // Insert using raw query so the geometry is set correctly and tenant is taken from session
    const res = await this.repo.query(
      `INSERT INTO incidents (tenant_id, creator_id, location, location_text, type, severity, notes, status)
       VALUES (current_setting('fms.current_tenant')::uuid, $1, ${loc()}, $2, $3, $4, $5) RETURNING id`,
      [payload.creator_id || null, payload.location_text || null, payload.type || null, payload.severity || null, payload.notes || null]
    );
    return res && res[0] ? res[0] : null;
  }

  // Assign units to an incident atomically
  async assignUnits(incidentId: string, unitIds: string[], actorId?: string) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Ensure incident exists
      const inst = await client.query('SELECT id FROM incidents WHERE id = $1 FOR UPDATE', [incidentId]);
      if (!inst.rows.length) throw new Error('Incident not found');

      // Check units availability
      const q = `SELECT unit_id, status FROM units WHERE unit_id = ANY($1::uuid[]) FOR UPDATE`;
      const resUnits = await client.query(q, [unitIds]);
      for (const r of resUnits.rows) {
        if (r.status !== 'Available') {
          throw new Error(`Unit ${r.unit_id} not available`);
        }
      }

      // Update incident status
      await client.query(`UPDATE incidents SET status = 'Dispatched' WHERE id = $1`, [incidentId]);

      // Mark units and insert dispatch events and assignments
      for (const uid of unitIds) {
        await client.query(`UPDATE units SET status='Assigned' WHERE unit_id = $1`, [uid]);
        await client.query(
          `INSERT INTO dispatch_events (incident_id, unit_id, actor_id, action, details) VALUES ($1,$2,$3,'assign', $4)`
        , [incidentId, uid, actorId || null, JSON.stringify({ via: 'api' })]);
        await client.query(`INSERT INTO incident_assignments (incident_id, unit_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [incidentId, uid]);
      }

      await client.query('COMMIT');
      return { incidentId, assigned: unitIds };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
