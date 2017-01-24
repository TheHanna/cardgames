const uuid = require('uuid/v4');
class Room {
  constructor(user, params) {
    this.id = uuid();
    this.name = params.room;
    this.code = params.code;
    this.owner = user.id;
    this.members = {};
  }

  getRole(userId) {
    let role;
    if (userId === this.owner) {
      role = 'owner';
    } else if (Object.keys(this.members).indexOf(userId) > -1) {
      role = 'member';
    }
    return role;
  }

  listMembers() {
    return this.members;
  }
}

module.exports = Room;
