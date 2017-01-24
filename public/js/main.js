// TODO: Research VueJS components to modularize this code into multiple files

let connection = io();
let user;

let actionList = new Vue({
  el: '#actionList',
  data: {
    actions: []
  }
});

let roomList = new Vue({
  el: '#roomList',
  data: {
    rooms: []
  },
  methods: {
    leave: function(index) {
      connection.emit('room::leave', {user: user, code: this.rooms[index].code});
      this.rooms.splice(index, 1);
    }
  }
});

let roomForm = new Vue({
  el: '#roomForm',
  data: {
    name: null,
    code: null,
    visible: false
  },
  methods: {
    create: function() {
      connection.emit('room::create', {user: user, name: this.name});
    },
    join: function() {
      connection.emit('room::join', {user: user, code: this.code});
    }
  }
});

let connectForm = new Vue({
  el: '#connectForm',
  data: {
    name: null,
    visible: true
  },
  methods: {
    connect: function() {
      connection.emit('user::create', {name: this.name});
    }
  }
});

connection.on('user::create', (id) => {
  user = id;
  connectForm.visible = false;
  roomForm.visible = true;
});

connection.on('room::join', (room) => {
  roomList.rooms.push(room);
});

connection.on('room::leave', (message) => {
  actionList.actions.push(message);
});

connection.on('base::error', (message) => {
  actionList.actions.push(message);
});