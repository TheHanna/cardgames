class Base {
  error(socket, message) {
    socket.emit('base::error', message);
  }
}

module.exports = Base;
