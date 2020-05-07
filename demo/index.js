const WebSocket = require('ws');

const WebSocketServer = WebSocket.Server;

const wss = new WebSocketServer({
  port: 3000
});

console.log('WebSocketServer started at port 3000...');

let count = 0; //在线人数

//let ws = new WebSocket('ws://192.168.1.45:3000');
let ws = new WebSocket('ws://111.229.58.78:3000');

ws.on('open', function(e) {
  console.log(`[WebSocket] 打开连接()`);
});

wss.on('connection', function(ws) {
  console.log(`新用户连接` + new Date());
  count++;
  wss.clients.forEach(function(client) {
    client.send(count);
  });

  ws.on('message', function(message) {
    let Nmessage = JSON.parse(message);
    if (Nmessage.type === 'login') {
      console.log(Nmessage.username + '进入了聊天室');
      wss.clients.forEach(function(client) {
        client.send(
          JSON.stringify({
            user: Nmessage.username,
            type: 'newuser'
          })
        );
      });
    }

    if (Nmessage.type === 'heart') {
      wss.clients.forEach(function(client) {
        client.send(
          JSON.stringify({
            type: 'heart'
          })
        );
      });
    }

    if (Nmessage.type === 'message') {
      console.log(Nmessage.userName + '说：' + Nmessage.userValue);
      wss.clients.forEach(function(client) {
        client.send(message);
      });
    }

    if (Nmessage.type === 'img') {
      wss.clients.forEach(function(client) {
        client.send(message);
      });
    }
  });
  ws.on('close', function(message) {
    count--;
    console.log(`[WebSocket] 关闭连接，用户退出()`);
    wss.clients.forEach(function(client) {
      client.send(count);
    });
  });
});
