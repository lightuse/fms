import { readFileSync } from 'fs';
import { describe, it, expect } from 'vitest';

describe('OpenAPI contract presence', () => {
  const specPath = new URL('../../contracts/openapi.yaml', import.meta.url);
  const content = readFileSync(specPath, 'utf8');

  it('contains /incidents POST path', () => {
    expect(content).toContain('/incidents:');
    expect(content).toContain('post:');
    expect(content).toContain('IncidentCreate');
  });

  it('contains /incidents/{id}/assign POST path', () => {
    expect(content).toContain('/incidents/{id}/assign:');
    expect(content).toContain('AssignRequest');
  });
});
