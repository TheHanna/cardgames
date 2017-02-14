const connection = require('../../socket.js');

module.exports = {
  name: 'Room',
  data: function() {
    return {
      visible: false,
      user: null,
      room: null,
      message: null,
      messages: []
    };
  },
  created: function() {
    connection.on('room::message', (message) => {
      this.messages.push(message);
    });
  },
  methods: {
    chat: function(evt) {
      evt.preventDefault();
      connection.emit('room::message', {
        user: this.user,
        code: this.room.code,
        message: this.message
      });
      this.message = null;
    }
  }
};
