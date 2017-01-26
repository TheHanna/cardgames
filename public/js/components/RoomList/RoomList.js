const connection = require('../../socket.js');

module.exports = {
  name: 'RoomList',
  data: function() {
    return {
      rooms: []
    };
  },
  created: function() {
    let self = this;
    self.$on('add', function(room) {
      self.rooms.push(room);
    });
    self.connection = self.$parent.connection;
  },
  methods: {
    leave: function(index) {
      connection.emit('room::leave', {user: this.$parent. user, code: this.rooms[index].code});
      this.rooms.splice(index, 1);
    }
  }
};
