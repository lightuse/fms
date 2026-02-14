import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
<<<<<<< HEAD

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
=======
>>>>>>> origin/001-create-frontend
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
<<<<<<< HEAD
          if (SECRET) payload = jwt.verify(token, SECRET);
          else payload = jwt.decode(token);
        } catch (e) {
          // ignore verification errors for now
=======
          if (SECRET) payload = jwt.verify(token, SECRET as string);
          else payload = jwt.decode(token);
        } catch (e) {
>>>>>>> origin/001-create-frontend
          payload = jwt.decode(token);
        }
      }

<<<<<<< HEAD
      const tenantId = payload && payload.tenant_id ? payload.tenant_id : null;
      if (tenantId) {
        // set session variable for this connection
=======
      const tenantId = payload && (payload as any).tenant_id ? (payload as any).tenant_id : null;
      if (tenantId) {
>>>>>>> origin/001-create-frontend
        const client = await pool.connect();
        try {
          await client.query("SELECT set_config('fms.current_tenant', $1, true)", [tenantId]);
        } finally {
<<<<<<< HEAD
          // release immediately; application queries should use pool and will inherit session via set_config with 'true' (transaction-local) if same connection used
          client.release();
        }
        // attach tenant to request for handlers
=======
          client.release();
        }
>>>>>>> origin/001-create-frontend
        (req as any).tenant = tenantId;
      }
    } catch (err) {
      // continue without tenant
    }
    next();
  }
}
