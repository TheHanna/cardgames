const debug = require('debug')('cardgames:socket');
const express = require('express');
const app = express();
const http = require('http').Server(app);
global.io = require('socket.io')(http);
global.Rooms = new (require('./modules/room/rooms.js'));

app.use(express.static(`${__dirname}/../public`));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// TODO: Abstract this out to separate file(s?)
io.on('connection', (socket) => {
  debug(socket.id, 'connected');
  // TODO: Figure out reconnection
  socket.on('user::name', (name) => {
    socket.name = name;
    debug('Socket', socket.id, 'has name', socket.name);
    socket.emit('user::named');
  });
  socket.on('disconnecting', () => {
    debug(socket.name, 'is about to disconnect');
    socket.emit('user::disconnect');
  });
  socket.on('disconnect', () => {
    debug(socket.name, 'disconnected');
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
