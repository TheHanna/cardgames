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

  create(socket, params) {
    debug(socket.name, 'is attempting to create a new room called', params.room);
    params.code = this.generateRoomCode();
    let room = new Room(socket, params);
    this._rooms[params.code] = room;
    this.join(socket, room.code);
  }

  join(socket, code) {
    debug(socket.name, 'is attempting to join with code', code);
    if (!this.exists(code)) {
      let message = 'Room does not exist.';
      debug(socket.name, 'failed to join room with code', code + '.', message);
      this.error(socket, message);
      return;
    }
    let room = this._rooms[code];
    if (!socket.role) socket.role = 'player';
    socket.join(code, () => {
      room.occupants.push(socket.id);
      socket.emit(`join::${socket.role}`, {
        name: room.name,
        code: room.code
      });
      debug(socket.name, 'joined', room.name);
    });
  }

  leave(socket, code) {
    debug(socket.name, 'is attempting to leave', code);
    if (!this.exists(code)) {
      let message = 'Room does not exist.';
      debug(socket.name, 'failed to leave room with code', code + '.', message);
      this.error(socket, message);
      return;
    }
    let room = this._rooms[code];
    socket.leave(code, () => {
      let i = room.occupants.indexOf(socket.id);
      if (i > -1) {
        room.occupants.splice(i, 1);
        socket.emit('leave', `${socket.name} left room ${room.name}`);
        debug(socket.name, 'left', room.name);
      }
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
