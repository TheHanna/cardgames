const connection = require('../../socket.js');

module.exports = {
  name: 'RoomForm',
  components: {
    'room-list': require('../RoomList/RoomList.vue'),
    'action-list': require('../ActionList/ActionList.vue')
  },
  data: function() {
    return {
      name: null,
      code: null,
      visible: false
    };
  },
  created: function() {
    connection.on('room::joined', (room) => {
      this.$refs.rooms.$emit('add', room);
    });

    connection.on('room::left', (message) => {
      this.$refs.actions.$emit('add', {message: message, type: 'normal'});
    });

    connection.on('base::error', (message) => {
      this.$refs.actions.$emit('add', {message: message, type: 'error'});
    });
  },
  methods: {
    create: function(evt) {
      evt.preventDefault();
      connection.emit('room::create', this.name);
      this.name = null;
    },
    join: function(evt) {
      evt.preventDefault();
      connection.emit('room::join', {user: this.$parent.user, code: this.code});
      this.code = null;
    }
  }
};
