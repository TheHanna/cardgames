<template>
  <div id="app">
    <app-header :user="user"></app-header>
    <section>
      <router-view @connect="connect" :user="user"></router-view>
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
  },
  data() {
    return {
      user: { name: '', socket: null }
    }
  },
  methods: {
    connect(io, url, name) {
      this.user.socket = io(url);
      this.user.name = name;
      this.user.socket.emit('name::change', this.user.name);
      this.user.socket.on('disconnect', () => {
        this.user.socket = null;
        this.$router.push('/');
      });
      this.$router.push({
        name: 'Games',
        params: { user: this.user }
      });
    }
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
