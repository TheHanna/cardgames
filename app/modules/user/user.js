const uuid = require('uuid/v4');
class User {
  constructor(socket) {
    this.socket = socket;
    this.id = uuid();
    this.name = socket.name;
  }
}

module.exports = User;
