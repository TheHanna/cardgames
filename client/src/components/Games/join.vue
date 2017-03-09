<template>
  <form class="pure-form" @submit.prevent="join">
    <input type="text">
    <select v-model="game">
      <option v-for="option in games" :value="option">
        {{ option | capitalize }}
      </option>
    </select>
    <button type="submit"></button>
  </form>
</template>

<script>
export default {
  name: 'create',
  props: ['socket'],
  data () {
    return {
      games: ['war'],
      game: null
    }
  },
  methods: {
    create(evt) { this.socket.emit('game::create', this.game) }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button[type=submit]::after {
  content: '\2714';
}
</style>