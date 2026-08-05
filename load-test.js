import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 20 },  // Ramp up to 20 users
    { duration: '20s', target: 50 },  // Peak at 50 users
    { duration: '10s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],    // http errors should be < 1%
    http_req_duration: ['p(95)<500'], // 95% of requests should be < 500ms
  },
};

export default function () {
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

  // 1. Visit category page
  const catRes = http.get(`${BASE_URL}/tienda/drones-fpv-hd`);
  check(catRes, {
    'Category page status is 200': (r) => r.status === 200,
  });

  sleep(1);

  // 2. Visit sell used equipment page
  const sellRes = http.get(`${BASE_URL}/tienda/vender`);
  check(sellRes, {
    'Vender page status is 200': (r) => r.status === 200,
  });

  sleep(1);

  // 3. Search query
  const searchRes = http.get(`${BASE_URL}/tienda/buscar?q=drone`);
  check(searchRes, {
    'Search page status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
