function generateRoomCode() {
  let code = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 4; i++) {
    code += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return code;
}

module.exports = {
  generateRoomCode: generateRoomCode
};