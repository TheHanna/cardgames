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
  },
  methods: {
    leave: function(index) {
      connection.emit('room::leave', this.rooms[index].code);
      this.rooms.splice(index, 1);
    }
  }
};
