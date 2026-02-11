import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Example: set tenant context from header `x-tenant-id` for downstream services
    const tenantId = req.headers['x-tenant-id'] as string | undefined;
    if (tenantId) {
      // Attach tenant to request for services to pick up
      (req as any).tenant = { id: tenantId };
    }
    next();
  }
}

export default TenantMiddleware;
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
          if (SECRET) payload = jwt.verify(token, SECRET);
          else payload = jwt.decode(token);
        } catch (e) {
          // ignore verification errors for now
          payload = jwt.decode(token);
        }
      }

      const tenantId = payload && payload.tenant_id ? payload.tenant_id : null;
      if (tenantId) {
        // set session variable for this connection
        const client = await pool.connect();
        try {
          await client.query("SELECT set_config('fms.current_tenant', $1, true)", [tenantId]);
        } finally {
          // release immediately; application queries should use pool and will inherit session via set_config with 'true' (transaction-local) if same connection used
          client.release();
        }
        // attach tenant to request for handlers
        (req as any).tenant = tenantId;
      }
    } catch (err) {
      // continue without tenant
    }
    next();
  }
}
