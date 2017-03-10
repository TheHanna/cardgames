<template>
  <form class="pure-form" @submit.prevent="connect" v-if="!connected()">
    <fieldset>
      <legend>Please sign in</legend>
      <input type="text" placeholder="Username" v-model="name" pattern="[a-zA-Z0-9]{3,20}">
      <button type="submit" class="pure-button pure-button-primary">Sign in</button>
    </fieldset>
  </form>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'connect',
  props: ['user'],
  data () {
    return {
      name: this.user.name
    }
  },
  methods: {
    connect() {
      this.$emit('connect', io, 'http://localhost:3000', this.name);
    },
    connected() {
      if (!this.user.socket) return false;
      if (this.user.socket) return this.user.socket.connected;
    }
  }
}
</script>

<style scoped>

</style>
