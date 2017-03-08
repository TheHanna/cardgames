<template>
  <section>
    <h1>{{ code | uppercase }}</h1>
    <h2>{{ players }}</h2>
    <h3>{{ cards }}</h3>
    <div v-if="!hasStarted">
      <button type="button" v-on:click="start" v-if="dealer">Start</button>
    </div>
    <div v-if="hasStarted">
      <button type="button" v-on:click="play" :disabled="hasPlayed">Play</button>
    </div>
    <div class="errors">
      {{ errors[0] }}
    </div>
    <div class="messages">
      {{ messages[0] }}
    </div>
    <ul>
      <li v-for="play in currentPlays">
        {{ play.player.name }}:
        <span v-if="play.facing === 'up'" :class="play.card.suit">
          {{ play.card.rank }}
        </span>
        <span v-if="play.facing === 'down'">???</span>
      </li>
    </ul>
    <ul>
      <li v-for="play in pastPlays">
        {{ play.player.name }}:
        <span :class="play.card.suit">
          {{ play.card.rank }}
        </span>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'game',
  props: ['game', 'socket', 'room'],
  data() {
    return {
      players: 0,
      code: this.room,
      dealer: false,
      hasStarted: false,
      errors: [],
      messages: [],
      pastPlays: [],
      currentPlays: [],
      hasPlayed: false,
      cards: 0
    }
  },
  created() {
    let init = {
      event: (this.code) ? 'join' : 'create',
      data: (this.code) ? this.code : this.game.name
    };
    this.socket.emit(`game::${init.event}`, init.data);
    this.socket.on('game::joined', this.joined);
    this.socket.on('player::joined', players => this.players = players);
    this.socket.on('game::started', this.started);
    this.socket.on('game::played', this.played);
    this.socket.on('game::message', this.message);
    this.socket.on('game::error', this.error);
    this.socket.on('game::battle::resolved', this.battleComplete);
    this.socket.on('game::war::wagered', () => this.hasPlayed = false);
  },
  methods: {
    start() {
      this.socket.emit('game::start', this.code);
    },
    started(cards) {
      this.hasStarted = true;
      this.cards = cards;
    },
    play() {
      this.socket.emit('game::play', this.code);
    },
    played(play) {
      console.log(play);
      this.currentPlays.push(play);
      if (play.player.id === this.socket.id) this.hasPlayed = play.played;
    },
    joined(code, dealer) {
      this.code = code,
      this.dealer = dealer;
    },
    battleComplete(hands) {
      this.pastPlays = [...this.currentPlays, ...this.pastPlays];
      this.currentPlays = [];
      this.hasPlayed = false;
      hands.forEach(hand => {
        if (hand.owner === this.socket.id) this.cards = hand.size;
      });
    },
    error(message) {
      this.errors.unshift(message);
    },
    message(message) {
      this.messages.unshift(message);
    }
  }
}
</script>

<style scoped>
.errors, .hearts, .diamonds {
  color: #F00;
}

.clubs, .spades {
  color: #000;
}

.hearts::after {
  content: '\2665';
}

.diamonds::after {
  content: '\2666';
}

.spades::after {
  content: '\2660';
}

.clubs::after {
  content: '\2663';
}
</style>
