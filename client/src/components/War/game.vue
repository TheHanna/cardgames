<template>
  <section>
    <h1>{{ code | uppercase }}</h1>
    <h2>{{ players }}</h2>
    <div v-if="!started">
      <button type="button" v-on:click="start" v-if="dealer">Start</button>
    </div>
    <div v-if="started">
      <button type="button" v-on:click="play" v-if="started">Play</button>
    </div>
    <div class="errors">
      {{ errors[0] }}
    </div>
  </section>
</template>

<script>
export default {
  name: 'game',
  props: ['game', 'socket', 'room'],
  data () {
    return {
      players: 0,
      code: this.room,
      dealer: false,
      started: false,
      errors: []
    }
  },
  created () {
    if (!this.code) {
      this.socket.emit('game::create', this.game.name, game => {
        this.code = game.code;
        this.dealer = game.dealer;
        this.joined(game.players);
      });
    } else {
      this.socket.emit('game::join', this.code);
    }
    this.socket.on('game::joined', this.joined);
    this.socket.on('game::started', status => {
      this.started = true;
    });
    this.socket.on('game::error', this.error);
  },
  methods: {
    start () {
      this.socket.emit('game::start', this.code);
    },
    play () {
      this.socket.emit(`${this.code}::start`, this.code);
    },
    joined (players) {
      this.players = players;
    },
    error (message) {
      this.errors.unshift(message);
    }
  }
}
</script>

<style scoped>
.errors {
  color: red;
}
</style>
