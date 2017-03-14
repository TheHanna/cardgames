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
let user;

export default {
  name: 'connect',
  data () {
    return {
      name: (this.user) ? this.user.name : null
    }
  },
  computed: {
    user() { return this.$store.state.user }
  },
  methods: {
    connect() {
      this.$store.dispatch({
        type: 'createUser',
        socket: io('http://localhost:3000'),
        name: this.name
      }).then(() => {
        this.user.socket.emit('name::change', this.user.name);
        this.user.socket.on('disconnect', () => {
          this.$router.push('/');
        });
        this.$router.push({ name: 'Games' });
      });
    },
    connected() {
      if (!this.user) return false;
      if (this.user.socket) return this.user.socket.connected;
    }
  }
}
</script>

<style scoped>

</style>
