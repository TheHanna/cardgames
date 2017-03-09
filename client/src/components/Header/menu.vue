<template lang="html">
  <nav class="pure-menu pure-menu-horizontal">
    <ul class="pure-menu-list">
      <li class="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
        <create></create>
      </li>
      <li class="pure-menu-item">
        <button type="button" class="pure-button join" @click="$emit('join')">Join</button>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'menu',
  props: ['user']
  data() {
    return {
      games: ['war']
    }
  },
  methods: {

  }
}
</script>

<style scoped>
</style>
