const connection = require('./socket.js');

let app = new Vue({ // eslint-disable-line
  el: '#app',
  components: {
    'connect-form': require('./components/ConnectForm/ConnectForm.vue'),
    'room-form': require('./components/RoomForm/RoomForm.vue'),
    'room': require('./components/Room/Room.vue')
  },
  created: function() {
    connection.on('disconnect', () => {
      this.$refs.roomForm.visible = false;
      this.$refs.room.visible = false;
      this.$refs.connectForm.visible = true;
    });
    connection.on('user::named', (id) => {
      this.$refs.connectForm.visible = false;
      this.$refs.roomForm.visible = true;
      this.$refs.roomForm.user = id;
    });
    connection.on('room::joined', (room) => {
      this.$refs.room.owner = connection.id === room.owner;
      this.$refs.room.room = room;
      this.$refs.room.visible = true;
    });
    connection.on('room::left', (room) => {
      this.$refs.room.user = null;
      this.$refs.room.room = null;
      this.$refs.room.visible = false;
    });
  },
  data: {
    user: null
  }
});
