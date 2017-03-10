<template>
  <ul class="pure-menu-children">
    <li v-for="game in games" class="pure-menu-item">
      <span class="pure-menu-link" @click="user.socket.emit('game::create', game)">
        {{ game | capitalize }}
      </span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'create',
  props: ['user'],
  data () {
    return {
      games: ['war']
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