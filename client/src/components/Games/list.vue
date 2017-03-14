<template>
  <ul v-if="rooms">
    <li v-for="(room, code) in rooms" :class="{ open: !room.playing, closed: room.playing }">
      {{ code }} ({{ room.game.name }}) - {{ room.length }}
      <button type="button" @click="join(code)" v-if="!member(room)">Join</button>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'game-list',
  data() {
    return { rooms: [] };
  },
  computed: {
    user() { return this.$store.state.user }
  },
  created() {
    if (!this.user.socket) return;
    this.list();
    this.user.socket.on('game::created', this.list);
    this.user.socket.on('game::joined', this.list);
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

<style scoped>
.open {
  color: #0F0;
}

.closed {
  color: #F00;
}
</style>
