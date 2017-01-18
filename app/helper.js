function generateRoomCode() {
  let code = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 4; i++) {
    code += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return code;
}

function joinCallback(socket, data) {
  // TODO: Do some checks before allowing user to join (number of players allowed, current number of players, game, etc);
  // Log who joined the room
  console.log(`${socket.name} joined ${data.name}`);
  // Instantiate empty return object to pass back to client
  let ret = {
    name: data.name,
    code: data.code,
    owner: data.owner
  }
  socket.emit('joined', ret);
}

module.exports = {
  generateRoomCode: generateRoomCode,
  joinCallback: joinCallback
};
