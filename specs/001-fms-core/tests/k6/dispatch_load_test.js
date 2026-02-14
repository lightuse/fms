import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // ramp-up to 10 vus
    { duration: '1m', target: 10 },  // steady
    { duration: '20s', target: 0 },  // ramp-down
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // <1% errors
    http_req_duration: ['p(95)<500'], // 95% requests < 500ms
  },
};

// Set BASE to include the API prefix so paths align with OpenAPI server: http://localhost:3000/api
<<<<<<< HEAD
const BASE = __ENV.K6_BASE_URL || 'http://localhost:3000';
=======
const BASE = __ENV.K6_BASE_URL || 'http://localhost:3000/api';
>>>>>>> a8ff47e (feat(001-fms-core): infra + openapi + migrations + k6 path fixes; add docker-compose and migration runner)
const TENANT_ID = __ENV.K6_TENANT_ID || '11111111-1111-1111-1111-111111111111';
const AUTH = __ENV.K6_AUTH || '';

function headers() {
  const h = { 'Content-Type': 'application/json' };
  if (AUTH) h['Authorization'] = AUTH;
  return h;
}

export default function () {
  // 1) Create an incident
  const incidentPayload = JSON.stringify({
<<<<<<< HEAD
    // tenant_id must come from JWT claims (AUTH); do not send tenant_id in body
    type: 'Fire',
    severity: 'high',
    location: { type: 'Point', coordinates: [139.76705, 35.68145] },
    properties: { location_text: 'Load test incident', notes: 'k6 generated' },
  });

  let res = http.post(`${BASE}/incidents`, incidentPayload, { headers: headers() });
=======
    tenant_id: TENANT_ID,
    type: 'Fire',
    severity: 'High',
    location: { type: 'Point', coordinates: [139.76705, 35.68145] },
    location_text: 'Load test incident',
    notes: 'k6 generated',
  });

  let res = http.post(`${BASE}/v1/incidents`, incidentPayload, { headers: headers() });
>>>>>>> a8ff47e (feat(001-fms-core): infra + openapi + migrations + k6 path fixes; add docker-compose and migration runner)
  check(res, {
    'create incident status 201': (r) => r.status === 201 || r.status === 200,
  });

  let incidentId = null;
  try {
    incidentId = JSON.parse(res.body).id;
  } catch (e) {
    // fallback: parse Location header or skip
    incidentId = res.headers['Location'] || null;
  }

  // 2) Query nearby units
  const lat = 35.68145;
  const lon = 139.76705;
<<<<<<< HEAD
  const radius_m = 5000; // meters
  res = http.get(`${BASE}/units?near=${lon},${lat}&radius=${radius_m}`, { headers: headers() });
=======
  const radius_km = 5; // kilometers
  res = http.get(`${BASE}/v1/units?lat=${lat}&lon=${lon}&radius_km=${radius_km}`, { headers: headers() });
>>>>>>> a8ff47e (feat(001-fms-core): infra + openapi + migrations + k6 path fixes; add docker-compose and migration runner)
  check(res, {
    'nearby units 200': (r) => r.status === 200,
  });

  // 3) If we obtained an incident id and a unit id, dispatch
  if (incidentId) {
    // pick a unit from response if available
    let unitId = null;
    try {
      const body = JSON.parse(res.body || '{}');
      if (Array.isArray(body) && body.length > 0) unitId = body[0].id;
      if (body.units && Array.isArray(body.units) && body.units.length > 0) unitId = body.units[0].id;
    } catch (e) {}

    if (unitId) {
<<<<<<< HEAD
      const dispatchPayload = JSON.stringify({ incident_id: incidentId, unit_id: unitId });
      res = http.post(`${BASE}/dispatches`, dispatchPayload, { headers: headers() });
=======
      const dispatchPayload = JSON.stringify({ unit_id: unitId, issued_by: null });
      res = http.post(`${BASE}/v1/incidents/${incidentId}/dispatch`, dispatchPayload, { headers: headers() });
>>>>>>> a8ff47e (feat(001-fms-core): infra + openapi + migrations + k6 path fixes; add docker-compose and migration runner)
      check(res, { 'dispatch status 201': (r) => r.status === 201 || r.status === 200 });
    }
  }

  sleep(1);
}
