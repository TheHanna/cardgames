let app = new Vue({ // eslint-disable-line
  el: '#app',
  components: {
    'action-list': require('./components/ActionList/ActionList.vue'),
    'room-list': require('./components/RoomList/RoomList.vue'),
    'connect-form': require('./components/ConnectForm/ConnectForm.vue'),
    'room-form': require('./components/RoomForm/RoomForm.vue')
  },
  created: function() {
    this.connection.on('user::create', (id) => {
      console.log(id);
      this.user = id;
      this.$refs.connectForm.visible = false;
      this.$refs.roomForm.visible = true;
    });

    this.connection.on('room::join', (room) => {
      this.$refs.rooms.$emit('add', room);
    });

    this.connection.on('room::leave', (message) => {
      this.$refs.actions.$emit('add', {message: message, type: 'normal'});
    });

    this.connection.on('base::error', (message) => {
      this.$refs.actions.$emit('add', {message: message, type: 'error'});
    });
  },
  data: {
    connection: io(),
    user: null
  }
});
