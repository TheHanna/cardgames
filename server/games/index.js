const debug = require('debug')('cg:mw:games:index');
const _ = require('lodash');
const validGames = ['war'];
let server;
let rooms;

function generateCode() {
  let code = ''; // Blank string to store code string
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Only allow uppercase alpha chars
  const max = 4; // Limit of 4 characters
  for (let position = 0; position < max; position++) {
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return (!rooms[code]) ? code : generateCode();
}

function valid(game) {
  return _.includes(validGames, game);
}

module.exports = function(client, next) {
  // Define server and rooms at the top for easy reference
  server = client.server;
  rooms = server.sockets.adapter.rooms;

  // Create a game
  client.on('game::create', name => {
    debug('creating game', name);
    if (!valid(name)) {
      client.emit('game::error', `${name} is not a valid game`);
      return;
    }
    let code = generateCode();
    client.join(code);
    let room = rooms[code];
    room.game = require(`./${name}`);
    room.playing = false;
    client.emit('game::joined', code, true);
    server.to(code).emit('player::joined', room.length);
  });

  // Join a game that's been created
  client.on('game::join', code => {
    let room = rooms[code];
    if (room && !room.playing) {
      client.join(code);
      client.emit('game::joined', code, false);
      server.to(code).emit('player::joined', room.length);
    } else {
      client.emit('game::error', `${code} is not a valid game`);
      return;
    }
  });

  // Attempt to start the game
  client.on('game::start', code => {
    let room = rooms[code];
    if (room && room.game.ready(room.length)) {
      room.playing = true;
      room.game = new room.game.game(server, code);
    } else {
      client.emit('game::error', 'Game is not ready');
    }
  });

  client.on('games::list', fn => {
    fn(client.rooms);
  });

  // Move on to the next middleware
  next();
};
