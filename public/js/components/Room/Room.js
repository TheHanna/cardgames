const connection = require('../../socket.js');

module.exports = {
  name: 'Room',
  data: function() {
    return {
      visible: false,
      room: null,
      owner: false,
      game: null,
      message: null,
      messages: []
    };
  },
  created: function() {
    connection.on('room::messages', (msgs) => {
      console.log(msgs);
      this.messages = msgs;
    });

    connection.on('room::message', (message) => {
      this.messages.push(message);
    });
  },
  filters: {
    firstLetter: function(value) {
      if (!value) return '';
      value = value.toString();
      return value[0].toUpperCase();
    }
  },
  methods: {
    chat: function(evt) {
      evt.preventDefault();
      connection.emit('room::message', this.room.code, this.message);
      this.message = null;
    },
    start: function(evt) {
      evt.preventDefault();
      connection.emit('room::start', this.room.code, this.game);
    },
    play: function() {
      connection.emit('game::play', this.room.code);
    }
  }
};
