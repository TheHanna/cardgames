<template>
  <section>
    <h1>Games</h1>
    <ul>
      <li v-for="room in rooms">
        {{ room.code }}
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'games',
  props: ['user'],
  data() {
    return {
      rooms: []
    }
  },
  created() {
    this.user.socket.on('games::list', rooms => {
      this.rooms = rooms;
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
section {
  display: flex;
  height: 100%;
  flex-direction: column;
}

article { padding: 0 1em; }

[type=submit]::after {
  content: '\2714';
}
</style>
