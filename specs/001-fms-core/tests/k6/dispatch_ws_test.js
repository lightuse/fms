import ws from 'k6/ws';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '30s',
};

const WS_URL = __ENV.K6_WS_URL || 'ws://localhost:3000/socket';
const AUTH = __ENV.K6_AUTH || '';

export default function () {
  const params = { headers: { Authorization: AUTH } };
  const res = ws.connect(WS_URL, params, function (socket) {
    socket.on('open', function () {
      // send a subscribe message or ping depending on protocol
      socket.send(JSON.stringify({ type: 'subscribe', channel: 'dispatch' }));
    });

    socket.on('message', function (message) {
      // basic check that we receive something
    });

    socket.on('close', function () {
      // closed
    });

    socket.on('error', function (e) {
      // error
    });

    // keep connection alive for a short time
    sleep(1);
    socket.close();
  });

  check(res, { 'ws status 101': (r) => r && r.status === 101 });
}
