const helper = require('./app/helper.js');
const deck = require('./app/deck.js');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const rooms = {};
const users = {}; // TODO: track users as they connect; avoid duplicate usernames in same game

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// TODO: Abstract this out to separate file(s?)
io.on('connection', (socket) => {
  // TODO: Figure out reconnection
  console.log(socket.id, 'connected!');
  socket.on('create', (params) => {
    // Assign the socket the name provided by the game creator
    socket.name = params.name;
    // Generate a random 4-letter access code so others can join the game
    const accessCode = helper.generateRoomCode();
    // Make sure the access code isn't already being used
    while(Object.keys(rooms).indexOf(accessCode) > -1) {
      accessCode = helper.generateRoomCode();
    }
    // Keep track of room information
    rooms[accessCode] = {
      name: params.roomName,
      code: accessCode,
      owner: {
        id: socket.id,
        name: socket.name
      },
      deck: new deck.Deck().shuffle()
    };
    socket.join(accessCode, helper.joinCallback(socket, rooms[accessCode]));
  });
  socket.on('join', (params) => {
    socket.name = params.name;
    socket.join(params.code, helper.joinCallback(socket, rooms[accessCode]));
  });
  socket.on('shuffle', () => {
    console.log('shuffling');
    // TODO: figure out how to allow only shuffling of the current game
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
})