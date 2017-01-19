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
  socket.on('create', (params) => {
    debug(socket.id, 'begin room creation', params.room);
    socket.name = params.name;  // Assign the socket the name provided by the game creator
    Rooms.create(socket, params); // Create the room inside the room manager
  });
  socket.on('join', (params) => {
    socket.name = params.name;
    Rooms.join(socket, params.code);
  });
  socket.on('shuffle', () => {
    console.log('shuffling');
    // TODO: figure out how to allow only shuffling of the current game
    // TODO: figure out how to allow only shuffling by the current dealer
  });
  socket.on('disconnecting', () => {
    console.log(socket.id, 'is about to disconnect');
    console.log(socket.rooms);
    // TODO: Check disconnecting users rooms; start destruction countdown if user count is zero upon current user leaving; promote other user to owner otherwise
  });
  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected!');
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
