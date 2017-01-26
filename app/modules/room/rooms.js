const debug = require('debug')('cardgames:rooms');
const Base = require('../base.js');
const Room = require('./room.js');
const ROOM_CODE_STRING = require('../../config/app.constants.js').ROOM_CODE_STRING;
const ROOM_CODE_LENGTH = require('../../config/app.constants.js').ROOM_CODE_LENGTH;

class Rooms extends Base {
  constructor() {
    super();
    this._rooms = {};
  }

  generateRoomCode() {
    let code = ''; // Blank string to store code string
    const possible = ROOM_CODE_STRING;
    const max = ROOM_CODE_LENGTH;
    for (let position = 0; position < max; position++) {
      code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    // Validate the room code
    //    if valid, return the generated code
    //    if invalid, return function call results
    return (this.validateRoomCode(code)) ? code : this.generateRoomCode();
  }

  validateRoomCode(code) {
    let codes = Object.keys(this._rooms);
    return codes.indexOf(code) === -1;
  }

  exists(code) {
    let codes = Object.keys(this._rooms);
    return codes.indexOf(code) > -1;
  }

  create(user, params) {
    debug(user.name, 'is attempting to create a new room called', params.name);
    params.code = this.generateRoomCode();
    let room = new Room(user, params);
    this._rooms[params.code] = room;
    debug(user.name, 'has created the room', room.name);
    this.join(user, room.code);
  }

  join(user, code) {
    debug(user.name, 'is attempting to join with code', code);
    if (!this.exists(code)) {
      let message = 'Room does not exist.';
      debug(user.name, 'failed to join room with code', code + '.', message);
      this.error(user, message);
      return;
    }
    let room = this._rooms[code];
    if (!user.role) user.role = 'player';
    user.socket.join(code, () => {
      room.members[user.id] = user;
      user.rooms[room.id] = room;
      user.socket.emit('room::join', {
        role: room.getRole(user.id),
        name: room.name,
        code: room.code
      });
      debug(user.name, 'joined', room.name, 'as', room.getRole(user.id));
    });
  }

  leave(user, code) {
    debug(user.name, 'is attempting to leave', code);
    if (!this.exists(code)) {
      let message = 'Room does not exist.';
      debug(user.name, 'failed to leave room with code', code + '.', message);
      this.error(user, message);
      return;
    }
    let room = this._rooms[code];
    user.socket.leave(code, () => {
      delete(room.members[user.id]);
      delete(user.rooms[room.id]);
      user.socket.emit('room::leave', `You left room ${room.name}`);
      user.socket.to(room.code).emit('room::leave', `${user.name} left room ${room.name}`);
      debug(user.name, 'left', room.name);
    });
  }

  find(code) {
    return (exists) ? this._rooms[code] : 'Room does not exist';
  }

  list() {
    for (let room in this._rooms) {
      if (this._rooms.hasOwnProperty(room)) {
        debug(room);
      }
    }
    return this._rooms;
  }
}

module.exports = Rooms;
