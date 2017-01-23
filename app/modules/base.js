class Base {
  error(socket, message) {
    socket.emit('join::error', message);
  }
}

module.exports = Base;
