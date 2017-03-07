// const debug = require('debug')('cg:mw:games:base');
const _ = require('lodash');

class Game {
  constructor(server, code) {
    this.code = code;
    this.room = server.sockets.adapter.rooms[code];
    this.players = {};
    _.keys(this.room.sockets).forEach(socket => {
      this.players[socket] = {
        hand: []
      };
    });
  }

  getPlayerByIndex(index) {
    return this.players[_.keys(this.players)[index]];
  }
}

module.exports = Game;
