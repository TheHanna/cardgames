const debug = require('debug')('cardgames:rooms');
const Base = require('../base.js');
const Room = require('./room.js');
const ROOM_CODE_STRING = require('../../config/app.constants.js').ROOM_CODE_STRING;
const ROOM_CODE_LENGTH = require('../../config/app.constants.js').ROOM_CODE_LENGTH;

class Rooms extends Base {
  constructor() {
    super();
    this._rooms = {};
    io.on('connection', (socket) => {
      socket.use((packet, next) => {
        if (packet[0].split('::')[0] !== 'room') return next();
        if (this.exists(packet[1])) return next();
        next(new Error('No such room'));
      });
      socket.on('rooms::create', (name) => {
        debug(socket.name, 'wants to create a room called', name);
        this.create(socket, name);
      });
      socket.on('room::join', (code) => {
        debug(socket.name, 'wants to join a room with the code', code);
        this.find(code).join(socket);
      });
      socket.on('room::leave', (code) => {
        debug(socket.name, 'wants to leave room', code);
        this.find(code).leave(socket, this.destroy);
      });
      socket.on('room::message', (code, message) => {
        debug(socket.name, 'sent the message:', message);
        this.find(code).message(message);
      });
      socket.on('room::start', (code, game) => {
        debug(socket.name, 'wants to start a game of', game, 'in', code);
        this.find(code).start(socket, game);
      });
      // socket.on('game::play', (code) => {
      //   this.find(code).game.play(socket.id);
      // });
    });
  }

  generateCode() {
    let codes = Object.keys(this._rooms);
    let code = ''; // Blank string to store code string
    const possible = ROOM_CODE_STRING;
    const max = ROOM_CODE_LENGTH;
    for (let position = 0; position < max; position++) {
      code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return (codes.indexOf(code) === -1) ? code : this.generateCode();
  }

  create(socket, name) {
    debug(socket.name, 'is attempting to create a new room called', name);
    let code = this.generateCode();
    this._rooms[code] = new Room(socket, name, code);
    debug(socket.name, 'has created the room', name);
  }

  destroy(code) {
    if (this.exists(code)) delete this._rooms[code];
  }

  exists(code) {
    return Object.keys(this._rooms).indexOf(code) > -1;
  }

  find(code) {
    return (this.exists(code)) ? this._rooms[code] : null;
  }

  get list() {
    return this._rooms;
  }
}

module.exports = Rooms;
