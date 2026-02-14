import { Request, Response, NextFunction } from 'express';

// Minimal test auth stub: useful for local integration tests where Keycloak
// is not available. Attach a test user to the request when X-TEST-USER header present.
export function testAuthStub(req: Request, res: Response, next: NextFunction) {
  const header = req.headers['x-test-user'];
  if (header) {
    (req as any).user = {
      user_id: String(header),
      roles: ['dispatcher'],
      tenant_id: req.headers['x-tenant-id'] || 'test-tenant',
    };
  }
  next();
}

export default testAuthStub;
