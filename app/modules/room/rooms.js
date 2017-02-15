const debug = require('debug')('cardgames:rooms');
const Base = require('../base.js');
const Room = require('./room.js');
const ROOM_CODE_STRING = require('../../config/app.constants.js').ROOM_CODE_STRING;
const ROOM_CODE_LENGTH = require('../../config/app.constants.js').ROOM_CODE_LENGTH;
const VALID_GAMES = require('../../config/app.constants.js').VALID_GAMES;

class Rooms extends Base {
  constructor() {
    super();
    this._rooms = {};
    io.on('connection', (socket) => {
      socket.on('room::create', (name) => {
        debug(socket.name, 'wants to create a room called', name);
        this.create(socket, name);
      });
      socket.on('room::join', (params) => {
        let room = this.find(params.code);
        debug(socket.name, 'wants to join a room with the code', params.code);
        if (room) {
          room.join(socket);
        } else {
          this.error(socket, 'No such room');
        }
      });
      socket.on('room::leave', (code) => {
        let room = this.find(code);
        debug(socket.name, 'wants to leave room', room.name);
        if (room) {
          room.leave(socket, () => {
            if (room.isEmpty) {
              debug(room.name, 'is empty, destroying');
              delete this._rooms[code];
            }
          });
        } else {
          this.error(socket, 'No such room');
        }
      });
      socket.on('room::message', (code, message) => {
        let room = this.find(code);
        debug(socket.name, 'sent the message:', message);
        if (room) {
          room.message(socket, message);
        } else {
          this.error(socket, 'No such room');
        }
        // debug(params.user, 'wants to send a message');
        // this.message(
        //   socket,
        //   params.code,
        //   params.message
        // );
      });
      socket.on('room::start', (params) => {
        debug(params.user, 'wants to start a game in a room');
        this.start(
          socket,
          params.code,
          params.game
        );
      });
    });
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

  create(socket, name) {
    debug(socket.name, 'is attempting to create a new room called', name);
    let code = this.generateRoomCode();
    this._rooms[code] = new Room(socket, name, code);
    debug(socket.name, 'has created the room', name);
  }

  // leave(user, code) {
  //   debug(user.name, 'is attempting to leave', code);
  //   if (!this.exists(code)) {
  //     let message = 'Room does not exist.';
  //     debug(user.name, 'failed to leave room with code', code + '.', message);
  //     this.error(user, message);
  //     return;
  //   }
  //   let room = this._rooms[code];
  //   user.socket.leave(code, () => {
  //     delete(room.members[user.id]);
  //     delete(user.rooms[room.id]);
  //     user.socket.emit('room::leave', `You left room ${room.name}`);
  //     user.socket.to(room.code).emit('room::leave', `${user.name} left room ${room.name}`);
  //     debug(user.name, 'left', room.name);
  //     if (!room.hasMembers) {
  //       debug(room.name, 'is empty');
  //       delete this._rooms[code];
  //       debug(room.name, 'destroyed');
  //     }
  //   });
  // }

  // message(user, code, message) {
  //   if (!this.exists(code)) {
  //     let errorMessage = 'Room does not exist.';
  //     debug(user.name, 'failed to send message to room with code', code + '.');
  //     this.error(user, errorMessage);
  //     return;
  //   }
  //   let room = io.sockets.in(code);
  //   room.emit('room::message', {user: user.name, message: message});
  // }

  start(user, code, game) {
    if (!this.exists(code)) {
      let errorMessage = 'Room does not exist.';
      debug(user.name, 'failed to start game in room with code', code + '.');
      this.error(user, errorMessage);
      return;
    }
    if (VALID_GAMES.indexOf(game) > -1) {
      let room = this._rooms[code];
      room.startGame(game);
    }
  }

  find(code) {
    return (this.exists(code)) ? this._rooms[code] : null;
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
