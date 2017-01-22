const Base = require('./base.js');
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

  create(socket) {
    let user = new User(socket);
    this._users[user.id] = user;
  }

  find(id) {
    return (exists) ? this._users[id] : 'User does not exist';
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
