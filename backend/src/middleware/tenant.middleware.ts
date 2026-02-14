import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = req.header('authorization') || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
      let payload: any = null;
      if (token) {
        try {
          const SECRET = process.env.JWT_SECRET || '';
          if (SECRET) payload = jwt.verify(token, SECRET as string);
          else payload = jwt.decode(token);
        } catch (e) {
          payload = jwt.decode(token);
        }
      }

      const tenantId = payload && (payload as any).tenant_id ? (payload as any).tenant_id : null;
      if (tenantId) {
        const client = await pool.connect();
        try {
          await client.query("SELECT set_config('fms.current_tenant', $1, true)", [tenantId]);
        } finally {
          client.release();
        }
        (req as any).tenant = tenantId;
      }
    } catch (err) {
      // continue without tenant
    }
    next();
  }
}
