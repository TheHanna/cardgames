<template>
  <section>
    <h1>Pick a game:</h1>
    <ul>
      <li v-for="game in games">
        <router-link :to="game">{{ game | capitalize }}</router-link>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'games',
  data () {
    return {
      games: ['war']
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
