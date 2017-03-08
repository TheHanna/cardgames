const debug = require('debug')('cg:mw:games:base');
const _ = require('lodash');

class Game {
  constructor(server, code) {
    this.code = code; // Four letter room code
    this.server = server; // The socket.io instance
    this.room = server.sockets.adapter.rooms[code]; // Shortcut to the room info
    this.players = {}; // Empty object to track players
    _.keys(this.room.sockets).forEach(socket => { // Populate players based on sockets in room
      this.players[socket] = {
        client: server.sockets.sockets[socket] // Shortcut to players socket connection
      };
    });
  }

  getPlayer(id) {
    return this.players[id];
  }

  getPlayers(ids) {
    return _.map(ids, id => this.players[id]);
  }

  getPlayerByIndex(index) {
    return this.players[_.keys(this.players)[index]];
  }
}

module.exports = Game;
