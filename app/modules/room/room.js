const debug = require('debug')('cardgames:room');

class Room {
  constructor(socket, name, code) {
    this.name = name;
    this.code = code;
    this.owner = socket;
    this.members = [];
    this.msgs = [];
    this.join(socket);
  }

  join(socket) {
    debug(socket.name, 'is attempting to join', this.name);
    debug(this.isMember(socket.id));
    if (!this.isMember(socket.id)) {
      socket.join(this.code, () => {
        this.members.push(socket);
        socket.emit('room::joined', {
          name: this.name,
          code: this.code,
          role: this.getRole(socket.id),
        });
        debug(socket.name, 'joined', this.name, 'as', this.getRole(socket.id));
        if (this.game) {
          room.game.addPlayer(user.id);
          debug(socket.name, 'joined game in progress in room', this.name);
        }
        if (this.msgs.length > 0) {
          socket.emit('room::messages', this.msgs);
          debug(socket.name, 'received past messages for room', this.name);
        }
      });
    };
  }

  leave(socket, callback) {
    debug(socket.name, 'is attempting to leave', this.name);
    if (this.isMember(socket.id)) {
      socket.leave(this.code, () => {
        let index = this.members.findIndex((x) => {
          x.id === socket.id;
        });
        this.members.splice(index, 1);
        socket.emit('room::left', `You left room ${this.name}`);
        socket.to(this.code).emit('room::left', `${socket.name} left room ${this.name}`);
        debug(socket.name, 'left', this.name);
        callback();
      });
    }
  }

  message(socket, message) {
    debug(socket.name, 'is attempting to send the message', message);
    if (this.isMember(socket.id)) {
      let messageObject = { user: socket.name, message: message };
      this.msgs.push(messageObject);
      io.sockets.in(this.code).emit('room::message', messageObject);
    }
  }

  getRole(id) {
    return (id === this.owner) ? 'owner' : 'member';
  }

  startGame(game) {
    this.game = new (require(`../games/${game}/${game}.js`));
    for (let member in this.members) {
      if (this.members.hasOwnProperty(member)) {
        this.game.addPlayer(member);
      }
    }
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
