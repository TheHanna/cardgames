const winston = require('winston');
const Room = require('./room.js');

class Rooms {
  constructor() {
    this._rooms = {};
  }

  generateRoomCode() {
    let code = ''; // Blank string to store code string
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // TODO: Move this to a constant/config
    for (let position = 0; position < 4; position++) { // TODO: Move code length to constant/config
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
    params.code = this.generateRoomCode();
    let room = new Room(socket, params);
    this._rooms[params.code] = room;
    this.join(socket, room.code);
  }

  join(socket, code) {
    if (!this.exists(code)) {
      this.error(socket, 'Room does not exist');
      return;
    }
    let room = this._rooms[code];
    if (!socket.role) socket.role = 'player';
    winston.log('info', 'joining room;', {
      room: code,
      user: socket.name,
      role: socket.role });
    socket.join(code, () => {
      room.occupants.push(socket);
      socket.emit(`join::${socket.role}`, {
        name: room.name,
        code: room.code
      });
    });
  }

  find(code) {
    return (exists) ? this._rooms[code] : 'Room does not exist';
  }

  list() {
    for (let room in this._rooms) {
      if (this._rooms.hasOwnProperty(room)) {
        console.log(room);
      }
    }
    return this._rooms;
  }

  error(socket, message) {
    winston.log('error', message);
    socket.emit('join::error', message);
  }
}

module.exports = Rooms;
