const uuid = require('uuid/v4');
class User {
  constructor(socket, params) {
    this.socket = socket;
    this.id = uuid();
    this.name = params.name;
    this.rooms = {};
  }
}

module.exports = User;
