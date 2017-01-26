module.exports = {
  name: 'RoomForm',
  data: function() {
    return {
      name: null,
      code: null,
      visible: false
    };
  },
  created: function() {
    this.connection = this.$parent.connection;
  },
  methods: {
    create: function() {
      this.connection.emit('room::create', {user: this.$parent.user, name: this.name});
    },
    join: function() {
      this.connection.emit('room::join', {user: this.$parent.user, code: this.code});
    }
  }
};
