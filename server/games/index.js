const debug = require('debug')('cg:mw:games:index');
const _ = require('lodash');
const validGames = ['war'];

function generateCode() {
  let code = ''; // Blank string to store code string
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const max = 4;
  for (let position = 0; position < max; position++) {
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return code;
}

function valid(game) {
  return _.includes(validGames, game);
}

module.exports = function(client, next) {
  // Define server and rooms at the top for easy reference
  let server = client.server;
  let rooms = server.sockets.adapter.rooms;

  // Create a game
  client.on('game::create', (name, fn) => {
    if (!valid(name)) {
      client.emit('game::error', `${name} is not a valid game`);
      return;
    }
    let code = generateCode();
    client.join(code);
    let room = rooms[code];
    room.game = require(`./${name}`);
    fn({code: code, players: room.length, dealer: true});
  });

  // Join a game that's been created
  client.on('game::join', code => {
    let room = rooms[code];
    if (room) {
      client.join(code);
      server.to(code).emit('game::joined', room.length);
    } else {
      client.emit('game::error', `${code} is not a valid game`);
      return;
    }
  });

  // Attempt to start the game
  client.on('game::start', code => {
    let room = rooms[code];
    if (room && room.game.ready(room.length)) {
      room.game = new room.game.game(server, code);
      server.to(code).emit('game::started', true);
    } else {
      client.emit('game::error', 'Game is not ready');
    }
  });

  // Move on to the next middleware
  next();
};
