module.exports = {
  name: 'ConnectForm',
  data: function() {
    return {
      name: null,
      visible: true
    };
  },
  created: function() {
    this.connection = this.$parent.connection;
  },
  methods: {
    connect: function() {
      this.connection.emit('user::create', {name: this.name});
    }
  }
};
