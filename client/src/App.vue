<template>
  <div id="app">
    <app-header></app-header>
    <section>
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
import header from './components/Header';
import connect from './components/connect'

export default {
  name: 'app',
  components: {
    connect: connect,
    'app-header': header
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app > section {
  padding: 0 1em;
}
</style>
