import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './incident.entity';

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
}
