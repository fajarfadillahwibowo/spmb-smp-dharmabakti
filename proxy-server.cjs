/**
 * SPMB Dharma Bakti - Node.js Reverse Proxy
 *
 * Menerima request dari smartphone / web di 0.0.0.0:8000 dan meneruskannya ke
 * Laravel server di 127.0.0.1:8001.
 */

const http = require('http');

const TARGET_HOST = '127.0.0.1';
const TARGET_PORT = 8001;
const LISTEN_PORT = 8000;
const LISTEN_HOST = '0.0.0.0';

const server = http.createServer((req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '86400',
    });
    res.end();
    return;
  }

  const options = {
    hostname: TARGET_HOST,
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `${TARGET_HOST}:${TARGET_PORT}`,
      'x-forwarded-for': req.socket.remoteAddress,
      'x-forwarded-proto': 'http',
      'x-forwarded-host': req.headers.host || `${LISTEN_HOST}:${LISTEN_PORT}`,
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    const headers = { ...proxyRes.headers };
    headers['access-control-allow-origin'] = '*';
    headers['access-control-allow-headers'] = '*';
    headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH';

    res.writeHead(proxyRes.statusCode, headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error(`[Proxy Error] ${req.method} ${req.url} -> ${err.message}`);
    if (!res.headersSent) {
      res.writeHead(502, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({
        success: false,
        error: 'Bad Gateway',
        message: 'Backend Laravel belum siap atau sedang dimuat.',
      }));
    }
  });

  req.pipe(proxyReq);
});

server.listen(LISTEN_PORT, LISTEN_HOST, () => {
  console.log(`[Proxy Server Aktif] http://${LISTEN_HOST}:${LISTEN_PORT} -> http://${TARGET_HOST}:${TARGET_PORT}`);
});
