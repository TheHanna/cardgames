<template>
  <section>
    <h1>{{ game.name | capitalize }}</h1>
    <form v-on:submit="start" v-if="!socket">
      <input type="text" v-model="name" placeholder="Username" pattern="[a-zA-Z0-9 ]{3,20}" required>
      <input type="text" v-model="code" placeholder="Code (optional)">
      <button type="submit">Start</button>
    </form>
    <player-menu :initialName="name" :socket="socket" v-if="socket"></player-menu>
    <game-area :game="game" :room="code" :socket="socket" v-if="socket"></game-area>
  </section>
</template>

<script>
import io from 'socket.io-client';
import player from './player.vue';
import game from './game.vue';

export default {
  name: 'war',
  components: {
    'player-menu': player,
    'game-area': game
  },
  data () {
    return {
      game: { name: 'war' },
      socket: null,
      name: null,
      code: null
    }
  },
  methods: {
    start: function(evt) {
      evt.preventDefault();
      this.socket = io('http://localhost:3000');
    }
  }
}
</script>
