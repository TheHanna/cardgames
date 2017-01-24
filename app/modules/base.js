class Base {
  error(user, message) {
    console.log(user);
    user.socket.emit('base::error', message);
  }
}

module.exports = Base;
