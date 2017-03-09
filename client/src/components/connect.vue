<template>
  <form class="pure-form" @submit.prevent="connect" v-if="!connected">
    <fieldset>
      <legend>Please sign in</legend>
      <input type="text" placeholder="Username" v-model="username" pattern="[a-zA-Z0-9]{3,20}">
      <button type="submit" class="pure-button pure-button-primary">Sign in</button>
    </fieldset>
  </form>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'connect',
  data () {
    return {
      username: null,
      connected: false
    }
  },
  methods: {
    connect() {
      this.$emit('connect', io, 'http://localhost:3000', this.username);
      this.connected = true;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
