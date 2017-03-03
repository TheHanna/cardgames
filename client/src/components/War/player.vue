<template>
  <section>
    <input type="checkbox" v-model="editing.name">
    <h2 v-on:click="editing.name=!editing.name" v-if="!editing.name">{{name}}</h2>
    <form v-on:submit="changeName" v-if="editing.name">
      <input type="text" v-model="name" autofocus>
      <button type="submit">Change</button>
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
</style>
