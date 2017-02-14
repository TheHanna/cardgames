const debug = require('debug')('cardgames:socket');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Rooms = new (require('./modules/room/rooms.js'));
const Users = new (require('./modules/user/users.js'));

app.use(express.static(`${__dirname}/../public`));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// TODO: Abstract this out to separate file(s?)
io.on('connection', (socket) => {
  debug(socket.id, 'connected');
  // TODO: Figure out reconnection
  socket.on('user::create', (params) => {
    Users.create(socket, params);
  });
  socket.on('room::create', (params) => {
    Rooms.create(Users.find(params.user), params);
  });
  socket.on('room::join', (params) => {
    Rooms.join(Users.find(params.user), params.code);
  });
  socket.on('room::leave', (params) => {
    debug('room::leave triggered with params:', params);
    Rooms.leave(Users.find(params.user), params.code);
  });
  socket.on('disconnecting', () => {
    socket.emit('user::disconnect');
    // Users.destroy(Users.find(user));
  });
  socket.on('user::disconnect', (user) => {
    Users.destroy(Users.find(user));
  });
  socket.on('disconnect', () => {
    debug(socket.id, 'disconnected!');
  });
  socket.on('room::message', (params) => {
    Rooms.message(
      Users.find(params.user),
      params.code,
      params.message,
      io.sockets.in(params.code)
    );
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
