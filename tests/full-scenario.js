import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const reqDuration = new Trend('req_duration', true);

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 15 },
    { duration: '30s', target: 25 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<600', 'p(99)<1200'],
    http_req_failed: ['rate<0.02'],
    errors: ['rate<0.02'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://jsonplaceholder.typicode.com';

export default function () {
  group('GET /posts', () => {
    const res = http.get(`${BASE_URL}/posts`);
    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 500ms': (r) => r.timings.duration < 500,
    });
    errorRate.add(res.status !== 200);
    reqDuration.add(res.timings.duration);
  });

  group('GET /users', () => {
    const res = http.get(`${BASE_URL}/users`);
    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 500ms': (r) => r.timings.duration < 500,
    });
    errorRate.add(res.status !== 200);
    reqDuration.add(res.timings.duration);
  });

  group('GET /posts/1/comments', () => {
    const res = http.get(`${BASE_URL}/posts/1/comments`);
    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 600ms': (r) => r.timings.duration < 600,
    });
    errorRate.add(res.status !== 200);
    reqDuration.add(res.timings.duration);
  });

  group('POST /posts', () => {
    const payload = JSON.stringify({
      title: 'Test Post',
      body: 'Performance test body',
      userId: 1,
    });
    const res = http.post(`${BASE_URL}/posts`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    check(res, {
      'status is 201': (r) => r.status === 201,
      'response time < 500ms': (r) => r.timings.duration < 500,
    });
    errorRate.add(res.status !== 201);
    reqDuration.add(res.timings.duration);
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    'reports/full-scenario-summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data),
  };
}

function textSummary(data) {
  const lines = [];
  lines.push('\n=== Full Scenario Summary ===');
  lines.push(`Total requests: ${data.metrics.http_reqs?.values?.count || 0}`);
  lines.push(`Failed requests: ${data.metrics.http_req_failed?.values?.rate || 0}`);
  lines.push(`Avg duration: ${data.metrics.http_req_duration?.values?.avg?.toFixed(2) || 0}ms`);
  lines.push(`p95 duration: ${data.metrics.http_req_duration?.values['p(95)']?.toFixed(2) || 0}ms`);
  lines.push(`p99 duration: ${data.metrics.http_req_duration?.values['p(99)']?.toFixed(2) || 0}ms`);
  return lines.join('\n');
}
