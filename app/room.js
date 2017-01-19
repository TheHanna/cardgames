// const winston = require('winston');
class Room {
  constructor(socket, params) {
    socket.role = 'owner';
    this.name = params.room;
    this.code = params.code;
    this.owner = {
      id: socket.id,
      name: socket.name
    };
    this.occupants = [];
    // this.join(socket, this.code);
    // this.game;
    // this.players;
  }
}

module.exports = Room;
