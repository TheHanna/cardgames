<template>
  <form class="pure-form" @submit.prevent="user.socket.emit('game::join', code)">
    <input type="text" v-model="code" pattern="[A-Z]{4}">
    <button type="submit">Join</button>
  </form>
</template>

<script>
export default {
  name: 'join',
  data() {
    return { code: null }
  },
  computed: {
    user() { return this.$store.state.user }
  },
  created() {
    this.user.socket.on('game::joined', (code, owner) => {
      this.$router.push('/games');
    });
  },
  methods: {
    join() {
      this.user.socket.emit('game::join', this.code);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button[type=submit]::after {
  content: '\2714';
}
</style>