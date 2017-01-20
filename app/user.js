// const winston = require('winston');
const uuid = require('uuid/v4');
class User {
  constructor(socket) {
    this.guid = uuid();
    this.id = socket.id;
    this.name = socket.name;
    // socket.role = 'owner';
    // this.name = params.room;
    // this.code = params.code;
    // this.owner = {
    //   id: socket.id,
    //   name: socket.name
    // };
    // this.occupants = [];
    // this.join(socket, this.code);
    // this.game;
    // this.players;
  }
}

module.exports = User;
