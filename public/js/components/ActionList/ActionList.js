module.exports = {
  name: 'ActionList',
  data: function() {
    return {
      actions: []
    };
  },
  created: function() {
    let self = this;
    self.$on('add', function(action) {
      self.actions.push(action);
    });
  }
};
