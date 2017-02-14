const connection = require('./socket.js');

let app = new Vue({ // eslint-disable-line
  el: '#app',
  components: {
    'connect-form': require('./components/ConnectForm/ConnectForm.vue'),
    'room-form': require('./components/RoomForm/RoomForm.vue'),
    'room': require('./components/Room/Room.vue')
  },
  created: function() {
    connection.on('user::create', (id) => {
      this.user = id;
      this.$refs.connectForm.visible = false;
      this.$refs.roomForm.visible = true;
      this.$refs.roomForm.user = id;
    });
    connection.on('room::join', (room) => {
      this.$refs.room.user = this.user;
      this.$refs.room.room = room;
      this.$refs.room.visible = true;
    });
    connection.on('room::leave', (room) => {
      this.$refs.room.user = null;
      this.$refs.room.room = null;
      this.$refs.room.visible = false;
    });
    connection.on('room::message', (message) => {
      console.log('main: ', message);
    });
  },
  data: {
    user: null
  }
});
