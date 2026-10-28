'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { spawn } = require('node:child_process');
const http = require('node:http');

function get(port, path) {
  return new Promise((resolve, reject) => {
    http.get({ port, path }, res => {
      let body = '';
      res.on('data', c => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

test('serves health and info', async () => {
  const port = 18080;
  const child = spawn(process.execPath, ['server.js'], { env: { ...process.env, PORT: String(port) } });
  try {
    for (let i = 0; i < 20; i++) {
      try { await get(port, '/healthz'); break; } catch { await new Promise(r => setTimeout(r, 100)); }
    }
    assert.strictEqual((await get(port, '/healthz')).status, 200);
    const info = JSON.parse((await get(port, '/api/info')).body);
    assert.strictEqual(info.app, 'demo-bad');
  } finally {
    child.kill();
  }
});
