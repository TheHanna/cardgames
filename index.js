const debug = require('debug')('cardgames:socket');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
// const games = {
//   war: {
//     players: {
//       max: 2,
//       min: 2
//     }
//   }
// };
const Rooms = new (require('./app/rooms.js'));

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// TODO: Abstract this out to separate file(s?)
io.on('connection', (socket) => {
  debug(socket.id, 'connected');
  // TODO: Abstract connection out to player class
  // TODO: Figure out reconnection
  socket.on('init', (data) => {
    debug(socket.id, 'named', data.name);
    socket.name = data.name;
  });
  socket.on('dude::bro', (data) => {
    console.log(data);
  });
  socket.on('create', (params) => {
    debug(socket.id, 'begin room creation', params.room);
    Rooms.create(socket, params); // Create the room inside the room manager
  });
  socket.on('join', (params) => {
    debug(socket.id, 'join room', params.code);
    Rooms.join(socket, params.code);
  });
  socket.on('leave', () => {
    console.log(socket.rooms);
  });
  socket.on('shuffle', () => {
    console.log('shuffling');
    // TODO: figure out how to allow only shuffling of the current game
    // TODO: figure out how to allow only shuffling by the current dealer
  });
  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected!');
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
