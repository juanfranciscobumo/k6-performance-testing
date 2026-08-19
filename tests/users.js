import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const reqDuration = new Trend('req_duration', true);

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
    errors: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://jsonplaceholder.typicode.com';

export default function () {
  const res = http.get(`${BASE_URL}/users`);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'has 10 users': (r) => JSON.parse(r.body).length === 10,
  });

  errorRate.add(res.status !== 200);
  reqDuration.add(res.timings.duration);

  sleep(1);
}

export function handleSummary(data) {
  return {
    'reports/users-summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data),
  };
}

function textSummary(data) {
  const lines = [];
  lines.push('\n=== Users Load Test Summary ===');
  lines.push(`Total requests: ${data.metrics.http_reqs?.values?.count || 0}`);
  lines.push(`Failed requests: ${data.metrics.http_req_failed?.values?.rate || 0}`);
  lines.push(`Avg duration: ${data.metrics.http_req_duration?.values?.avg?.toFixed(2) || 0}ms`);
  lines.push(`p95 duration: ${data.metrics.http_req_duration?.values['p(95)']?.toFixed(2) || 0}ms`);
  lines.push(`p99 duration: ${data.metrics.http_req_duration?.values['p(99)']?.toFixed(2) || 0}ms`);
  return lines.join('\n');
}
