const http = require('http');
const PORT = process.env.PORT || 3000;
const PATH = process.env.HEALTH_PATH || '/health';
http.get({ host: '127.0.0.1', port: PORT, path: PATH, timeout: 2000 }, (res) => {
  if (res.statusCode === 200) process.exit(0); else process.exit(1);
}).on('error', () => process.exit(1));