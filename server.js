const WebSocket = require('ws');
const http = require('http');

const poolHost = 'pool.supportxmr.com';
const poolPort = 3333;

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  const tcp = require('net').connect(poolPort, poolHost);

  ws.on('message', (msg) => {
    tcp.write(msg + "\n");
  });

  tcp.on('data', (data) => {
    ws.send(data.toString());
  });

  tcp.on('close', () => ws.close());
  ws.on('close', () => tcp.end());
});

server.listen(8181, () => {
  console.log('WebMinerPool proxy running on port 8181');
});
