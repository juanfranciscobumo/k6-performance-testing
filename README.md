# k6 Performance Testing

[![CI](https://github.com/juanfranciscobumo/k6-performance-testing/actions/workflows/ci.yml/badge.svg)](https://github.com/juanfranciscobumo/k6-performance-testing/actions/workflows/ci.yml)
[![k6](https://img.shields.io/badge/k6-0.52.0-red?style=flat-square&logo=k6)](https://k6.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-282A2E?style=flat-square&logo=githubactions&logoColor=white)](https://github.com/features/actions)

Performance and load testing suite using **k6** against JSONPlaceholder API, with automated CI/CD and GitHub Pages reporting.

## What This Project Does

Simulates real-world traffic patterns against a REST API to measure:
- **Response times** (avg, p95, p99)
- **Throughput** (requests per second)
- **Error rates** under load
- **Scalability** with gradual traffic ramp-up

## Test Scenarios

| Scenario | Virtual Users | Duration | Target |
|----------|--------------|----------|--------|
| Posts Load | 10 → 20 → 0 | 2min | `/posts` endpoint |
| Users Load | 10 → 20 → 0 | 2min | `/users` endpoint |
| Full Scenario | 5 → 15 → 25 → 0 | 3min | All endpoints (GET + POST) |

## Thresholds

| Metric | Threshold |
|--------|-----------|
| p95 response time | < 500ms |
| p99 response time | < 1000ms |
| Error rate | < 1% |

## Prerequisites

- [k6](https://k6.io/#get-k6) installed locally
- Node.js 18+ (for npm scripts)

## Installation

```bash
# Install k6 (macOS)
brew install k6

# Install k6 (Linux)
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6

# Install k6 (Windows)
choco install k6
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run test:posts` | Run posts endpoint load test |
| `npm run test:users` | Run users endpoint load test |
| `npm run test:full` | Run full scenario (all endpoints) |
| `npm run test:all` | Run all tests sequentially |
| `k6 run tests/posts.js` | Direct k6 execution |

## Project Structure

```
k6-performance-testing/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline
├── tests/
│   ├── posts.js                # Posts endpoint load test
│   ├── users.js                # Users endpoint load test
│   └── full-scenario.js        # Combined multi-endpoint test
├── reports/                    # Generated test results (gitignored)
├── package.json
└── README.md
```

## API Under Test

**JSONPlaceholder** — `https://jsonplaceholder.typicode.com`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | List all posts (100 items) |
| GET | `/users` | List all users (10 items) |
| GET | `/posts/1/comments` | List comments for post 1 |
| POST | `/posts` | Create a new post |

## Sample Output

```
     data_received.................: 12 MB  100 kB/s
     data_sent.....................: 856 kB 7.1 kB/s
     http_req_blocked..............: avg=1.2ms   min=0s     med=0s     max=150ms  p(90)=0s      p(95)=2ms
     http_req_connecting...........: avg=0.8ms   min=0s     med=0s     max=120ms  p(90)=0s      p(95)=1ms
     http_req_duration.............: avg=85.3ms  min=42ms   med=72ms   max=320ms  p(90)=145ms   p(95)=180ms  p(99)=250ms
     http_req_failed...............: 0.00%  ✓ 0        ✗ 850
     http_reqs.....................: 850    7.083333/s
```

## Technologies

- **k6** — Modern load testing tool
- **JavaScript** — Test scripting
- **GitHub Actions** — CI/CD pipeline
- **GitHub Pages** — Report hosting

## License

MIT
