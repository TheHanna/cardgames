const winston = require('winston');
const User = require('./user.js');

class Users {
  constructor() {
    this._users = {};
  }

  exists(id) {
    let ids = Object.keys(this._users);
    return ids.indexOf(id) > -1;
  }

  create(socket) {
    let user = new User(socket);
    this._users[id] = user;
  }

  find(id) {
    return (exists) ? this._users[id] : 'User does not exist';
  }

  list() {
    for (let user in this._users) {
      if (this._users.hasOwnProperty(user)) {
        console.log(user);
      }
    }
    return this._users;
  }

  error(socket, message) {
    winston.log('error', message);
    socket.emit('join::error', message);
  }
}

module.exports = Users;
