const connection = require('../../socket.js');

module.exports = {
  name: 'Room',
  data: function() {
    return {
      visible: false,
      room: null,
      owner: false,
      game: null,
      played: false,
      message: null,
      messages: [],
      notifications: []
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

    connection.on('game::started', (message) => {
      console.log('Game started');
    });

    connection.on('game::handWon', (winner) => {
      console.log(winner, 'won!');
    });

    connection.on('game::played', (value) => {
      this.played = value;
    });

    connection.on('game::message', (message) => {
      console.log(message);
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
