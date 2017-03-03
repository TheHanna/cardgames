const debug = require('debug')('cg:mw:games:index');
const _ = require('lodash');
const validGames = ['war'];
let game;


function generateCode() {
  let code = ''; // Blank string to store code string
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const max = 4;
  for (let position = 0; position < max; position++) {
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return code;
}

module.exports = function(client, next) {
  debug(client.server.sockets.adapter.rooms);
  client.on('game::start', (name, code) => {
    if (!code) {
      debug(client.name, 'wants to start a game of', name);
      if (_.includes(validGames, name)) {
        game = require(`./${name}`);
        code = generateCode();
        client.use(game);
        client.join(code);
        client.emit('game::started', code);
        debug(client.name, 'successfully started a game of', name, 'with code', code);
      }
    } else {
      debug(client.name, 'wants to join game', code);
    }
  });
  next();
};
