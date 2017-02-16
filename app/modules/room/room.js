const debug = require('debug')('cardgames:room');
const VALID_GAMES = require('../../config/app.constants.js').VALID_GAMES;

class Room {
  constructor(socket, name, code) {
    this.name = name;
    this.code = code;
    this.owner = socket.id;
    this.members = [];
    this.msgs = [];
    this.join(socket);
  }

  join(socket) {
    debug(socket.name, 'is attempting to join', this.name);
    if (this.isMember(socket.id)) return;
    socket.join(this.code, () => {
      this.members.push(socket);
      socket.emit('room::joined', {
        name: this.name,
        code: this.code,
        role: this.getRole(socket.id),
        owner: this.owner
      });
      debug(socket.name, 'joined', this.name, 'as', this.getRole(socket.id));
      if (this.game) {
        this.game.addPlayer(socket.id);
        debug(socket.name, 'joined game in progress in room', this.name);
      }
      if (this.msgs.length > 0) {
        socket.emit('room::messages', this.msgs);
        debug(socket.name, 'received past messages for room', this.name);
      }
    });
  }

  leave(socket) {
    debug(socket.name, 'is attempting to leave', this.name);
    if (!this.isMember(socket.id)) return;
    socket.leave(this.code, () => {
      let index = this.members.findIndex((x) => {
        x.id === socket.id;
      });
      this.members.splice(index, 1);
      socket.emit('room::left', `You left room ${this.name}`);
      socket.to(this.code).emit('room::left', `${socket.name} left room ${this.name}`);
      debug(socket.name, 'left', this.name);
      if (this.isEmpty) Rooms.destroy(this.code);
    });
  }

  message(socket, message) {
    debug(socket.name, 'is attempting to send the message', message);
    if (!this.isMember(socket.id)) return;
    let messageObject = { user: socket.name, message: message };
    this.msgs.push(messageObject);
    io.sockets.in(this.code).emit('room::message', messageObject);
  }

  start(socket, game) {
    if (VALID_GAMES.indexOf(game) === -1) return;
    this.game = new (require(`../games/${game}/${game}.js`));
    this.members.forEach((member) => {
      this.game.addPlayer(member.id);
    });
  }

  getRole(id) {
    return (id === this.owner) ? 'owner' : 'member';
  }

  isMember(id) {
    return this.members.filter((member) => {
      return member.id === id;
    }).length > 0;
  }

  get isEmpty() {
    return this.members.length === 0;
  }
}

module.exports = Room;
