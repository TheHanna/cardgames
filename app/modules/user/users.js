const debug = require('debug')('cardgames:users');
const Base = require('../base.js');
const User = require('./user.js');

class Users extends Base {
  constructor() {
    super();
    this._users = {};
  }

  exists(id) {
    let ids = Object.keys(this._users);
    return ids.indexOf(id) > -1;
  }

  create(socket, params) {
    debug(socket.id, 'is attempting to create a new user');
    let user = new User(socket, params);
    debug(socket.id, 'created new user with name', user.name, 'and ID', user.id);
    this._users[user.id] = user;
    socket.emit('user::create', user.id);
  }

  destroy(user) {
    debug(user.name, 'is disconnecting');
    console.log(user);
    user.rooms.forEach((room) => {
      debug(user.name, 'is leaving room', room.name);
      room.leave(user, room.code);
    });
  }

  find(id) {
    debug('attempting to find user by id:', id);
    return (this.exists(id)) ? this._users[id] : 'User does not exist';
  }

  list() {
    for (let user in this._users) {
      if (this._users.hasOwnProperty(user)) {
        debug(user);
      }
    }
    return this._users;
  }
}

module.exports = Users;
