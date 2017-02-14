const connection = require('../../socket.js');

module.exports = {
  name: 'ConnectForm',
  data: function() {
    return {
      name: null,
      visible: true
    };
  },
  methods: {
    connect: function(evt) {
      evt.preventDefault();
      connection.emit('user::create', {name: this.name});
      this.name = null;
    }
  }
};
