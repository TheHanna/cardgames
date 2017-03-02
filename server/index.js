const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const auth = require('./auth');

app.get('/', (req, res) => {
  res.send('Hi');
});

// Automatically name socket based on data passed from client
io.use(auth);

io.on('connection', client => {
  client.name = client.handshake.query.name;
  console.log(client.name, 'connecting!');
  client.use(auth);
  client.emit('connect::name', client.name);
  client.on('connect::name', name => {
    console.log(client.name, 'wants to change their name to', name);
    client.name = name;
    client.emit('connect::name', client.name);
  });

  client.on('disconnect', reason => {
    console.log(client.name, 'disconnecting!');
  });
});

http.listen(3000, () => {
  console.log('listening on port 3000');
});
