<template>
  <header class="pure-g">
    <div class="pure-u-1-5 title">
      <router-link to="/" tag="h1">Testing</router-link>
    </div>
    <div class="pure-u-3-5 menu" v-if="user.socket">
      <user-menu :user="user"></user-menu>
    </div>
    <div class="pure-u-1-5 user" v-if="user.socket">
      <h3>{{ user.name }}</h3>
    </div>
  </header>
</template>

<script>
import menu from './menu';

export default {
  name: 'header',
  props: ['user'],
  components: {
    'user-menu': menu
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
header {
  background-color: #888777;
  padding: 0 1em;
  margin-bottom: 0.5em;
}

header > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title { align-items: flex-start; }
.menu { align-items: center; }
.user { align-items: flex-end; }

.create::after, .join::after { padding-left: 0.5em; }
.create::after { content: '\271A'; }
.join::after { content: '\27A4'; }

</style>
