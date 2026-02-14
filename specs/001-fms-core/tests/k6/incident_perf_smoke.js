import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    'http_req_duration': ['p(95)<5000'], // 5s
    'errors': ['rate<0.01'],
  },
};

const BASE = __ENV.BASE_URL || 'http://localhost:3000';
const AUTH = __ENV.K6_AUTH || '';

export default function () {
  const headers = AUTH ? { headers: { Authorization: `Bearer ${AUTH}`, 'Content-Type': 'application/json' } } : { headers: { 'Content-Type': 'application/json' } };

  // GET incidents
  let res1 = http.get(`${BASE}/incidents`, headers);
  check(res1, {
    'get incidents status 200': (r) => r.status === 200,
  }) || errorRate.add(1);

  // POST incident (small payload)
  const payload = JSON.stringify({
    location: { type: 'Point', coordinates: [139.767, 35.681] },
    location_text: 'Load test point',
    type: 'fire',
    severity: 'low'
  });
  let res2 = http.post(`${BASE}/incidents`, payload, headers);
  check(res2, {
    'post incident created': (r) => r.status === 201 || r.status === 200,
  }) || errorRate.add(1);

  sleep(1);
}
