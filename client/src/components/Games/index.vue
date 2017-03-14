<template>
  <section>
    <h1>Games</h1>
    <game-list></game-list>
    <component v-bind:is="game" v-if="game"></component>
  </section>
</template>

<script>
import list from './list';

export default {
  name: 'games',
  components: {
    'game-list': list
  },
  data() {
    return { game: null }
  },
  created() {
    if (!this.user.socket) this.$router.push('/');
  },
  computed: {
    user() { return this.$store.state.user }
  }
}
</script>

<style scoped>
section {
  display: flex;
  height: 100%;
  flex-direction: column;
}
</style>
