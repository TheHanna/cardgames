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
    setName: function(evt) {
      evt.preventDefault();
      connection.emit('user::name', this.name);
      this.name = null;
    }
  }
};
