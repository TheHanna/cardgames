<template>
  <section>
    <h1>{{ code | uppercase }}</h1>
    <div>
      <button type="button" v-on:click="play" v-if="players === 2">Play</button>
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
      code: null
    }
  },
  created () {
    this.socket.emit('game::start', this.game.name, this.room);
    this.socket.on('game::started', code => {
      this.code = code;
    });
    this.socket.on('game::card::played', (player, card) => {
      console.log(player, card);
    });
  },
  methods: {
    play () {
      this.socket.emit('game::card::play');
    }
  }
}
</script>

<style scoped>

</style>
