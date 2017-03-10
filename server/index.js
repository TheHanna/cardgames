const debug = require('debug')('cg:index');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const user = require('./user');
const games = require('./games');

io.use(user);
io.use(games);

io.on('connection', client => {
  client.on('disconnecting', reason => {
    client.emit('disconnect');
  });

  client.on('disconnect', reason => {
    debug(client.name, 'disconnected!');
  });
});

http.listen(3000, () => {
  debug('listening on port 3000');
});
