<template>
  <section>
    <h1>Games</h1>
    <ul>
      <li v-for="(room, code) in rooms" :class="{ open: !room.playing, closed: room.playing }">
        {{ code }} ({{ room.game.name }}) - {{ room.length }}
        <button type="button" @click="join(code)" v-if="!member(room)">Join</button>
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
    console.log(this.user.socket);
    if (!this.user.socket) {
      this.$router.push('/');
      return;
    };
    this.list();
    this.user.socket.on('game::created', this.list);
    this.user.socket.on('games::list', rooms => this.rooms = rooms);
  },
  methods: {
    list() {
      this.user.socket.emit('games::list', rooms => { this.rooms = rooms; });
    },
    join(code) {
      this.user.socket.emit('game::join', code);
    },
    member(room) {
      return room.sockets[this.user.socket.id];
    }

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

.open {
  color: #0F0;
}

.closed {
  color: #F00;
}

article { padding: 0 1em; }

[type=submit]::after {
  content: '\2714';
}
</style>
