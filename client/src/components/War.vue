<template>
  <section>
    <h1>{{game.name}}</h1>
    <form v-on:submit="start" v-if="!socket.connected">
      <input type="text" v-model="name" placeholder="Username" pattern="[a-zA-Z0-9 ]{3,20}" required>
      <button type="submit">Start</button>
    </form>
    <form v-on:submit="changeName" v-if="socket.connected">
      <input type="text" v-model="name" placeholder="Username" pattern="[a-zA-Z0-9 ]{3,20}" required>
      <button type="submit">Change</button>
      <button type="button" v-on:click="stop">Disconnect</button>
    </form>
  </section>
</template>

<script>
import io from 'socket.io-client'
let data;
export default {
  name: 'war',
  data () {
    return {
      game: { name: 'War' },
      _name: null,
      name: null,
      socket: {}
    }
  },
  created: function() {
    data = this.$data;
  },
  methods: {
    start: function(evt) {
      evt.preventDefault();
      if (data.socket.connected === undefined) {
        data.socket = io('http://localhost:3000', {query: `name=${data.name}`});
        data.socket.on('connect::name', name => {
          if (data._name !== name) data._name = name;
        });
      } else {
        data.socket.open();
      }
    },
    stop: function(evt) {
      data.socket.close();
    },
    changeName: function(evt) {
      evt.preventDefault();
      if (data.name !== data._name) data.socket.emit('connect::name', data.name);
    }
  }
}
</script>
