function validateRoomCode(code) {
  return function(packet, next) {
    if (packet[1] === code) next();
  };
}

module.exports = validateRoomCode;
