<template lang="html">
  <nav class="pure-menu pure-menu-horizontal">
    <ul class="pure-menu-list">
      <li class="pure-menu-item">
        <router-link :to="{ name: 'Games', params: { user: user } }" class="pure-menu-link">
          Games
        </router-link>
      </li>
      <li class="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
        <a href="#" id="create" class="pure-menu-link">Create</a>
        <create :user="user"></create>
      </li>
      <li class="pure-menu-item">
        <button type="button" class="pure-button join">Join</button>
      </li>
    </ul>
  </nav>
</template>

<script>
import create from '../Games/create';

export default {
  name: 'menu',
  props: ['user'],
  components: {
    create: create
  }
}
</script>

<style scoped>
</style>
