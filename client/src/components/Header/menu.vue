<template lang="html">
  <nav class="pure-menu pure-menu-horizontal">
    <ul class="pure-menu-list">
      <li class="pure-menu-item">
        <router-link :to="{ name: 'Games' }" class="pure-menu-link">
          Games
        </router-link>
      </li>
      <li class="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
        <a href="#" id="create" class="pure-menu-link">Create</a>
        <create></create>
      </li>
      <li class="pure-menu-item">
        <router-link :to="{ name: 'Join' }" class="pure-menu-link">
          Join
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import create from '../Games/create';

export default {
  name: 'menu',
  components: {
    create: create
  },
  computed: {
    user() { return this.$store.state.user }
  }
}
</script>

<style scoped>
</style>
