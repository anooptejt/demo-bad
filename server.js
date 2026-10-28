'use strict';

const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const pkg = require('./package.json');

const PORT = Number(process.env.PORT) || 8080;
// 1.1.0 added a payments client that needs a gateway URL. It is not set in the
// deployment, so the process exits at startup.
const GATEWAY_URL = process.env.PAYMENT_GATEWAY_URL;
if (!GATEWAY_URL) {
  console.error('FATAL: PAYMENT_GATEWAY_URL is not set; the payments client cannot initialise');
  process.exit(1);
}

const BANNER = 'New: refunds are here.';

const info = {
  title: 'Payments Console',
  app: pkg.name,
  version: pkg.version,
  banner: BANNER,
  build: (process.env.GIT_SHA || 'local').slice(0, 7),
  pod: os.hostname(),
  startedAt: new Date().toISOString()
};

const page = fs.readFileSync(path.join(__dirname, 'public', 'index.html'));

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/healthz' || url === '/readyz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('ok');
  }
  if (url === '/api/info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(info));
  }
  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(page);
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('not found');
});

server.listen(PORT, () => {
  console.log(`${pkg.name} v${pkg.version} listening on :${PORT}`);
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
