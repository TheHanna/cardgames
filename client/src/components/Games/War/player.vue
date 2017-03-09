<template>
  <section>
    <input type="checkbox" v-model="editing.name">
    <h2 v-on:click="editing.name=!editing.name" v-if="!editing.name">{{name}}</h2>
    <form v-on:submit="changeName" v-if="editing.name">
      <input type="text" v-model="name" autofocus>
      <button type="submit">&#10004;</button>
    </form>
  </section>
</template>

<script>

export default {
  name: 'player',
  props: ['initialName', 'socket'],
  data () {
    return {
      editing: {
        name: false
      },
      name: this.initialName
    }
  },
  created () {
    this.changeName();
  },
  methods: {
    disconnect: function(evt) {
      this.socket.close();
    },
    changeName: function(evt) {
      if (evt) evt.preventDefault();
      this.socket.emit('name::change', this.name);
      this.editing.name = false;
    }
  }
}
</script>

<style scoped>
input[type="checkbox"] {
  display: none;
}

section {
  width: 100%;
  background-color: #888777;
}

section h2 {
  margin: 0;
  padding: 0.83em;
  display: inline-block;
  width: auto;
}

form input {
  font-size: 1.5em;
  padding: 0.83em;
  margin: 0;
  outline: none;
  border: none;
  font-weight: bold;
  background-color: #B3B2A8;
  width: auto;
}

form button[type=submit] {
  content: '\2714';
  width: 50px;
  height: 50px;
  padding: 25px 0;
  border: none;
}
</style>
