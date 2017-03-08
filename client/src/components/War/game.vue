<template>
  <section>
    <h1>{{ code | uppercase }}</h1>
    <h2>{{ players }}</h2>
    <div v-if="!started">
      <button type="button" v-on:click="start" v-if="dealer">Start</button>
    </div>
    <div v-if="started">
      <button type="button" v-on:click="play" v-if="started" :disabled="hasPlayed">Play</button>
    </div>
    <div class="errors">
      {{ errors[0] }}
    </div>
    <div class="messages">
      {{ messages[0] }}
    </div>
    <ul>
      <li v-for="play in plays">
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
      started: false,
      errors: [],
      messages: [],
      plays: [],
      hasPlayed: false
    }
  },
  created() {
    let c = strings => this.code + strings.join();
    if (!this.code) {
      this.socket.emit('game::create', this.game.name, game => {
        this.code = game.code;
        this.dealer = game.dealer;
        this.joined(game.players);
        this.socket.on(c`::played`, this.played);
      });
    } else {
      this.socket.emit('game::join', this.code);
      this.socket.on(c`::played`, this.played);
    }
    this.socket.on('game::joined', this.joined);
    this.socket.on('game::started', status => {
      this.started = true;
    });
    this.socket.on(c`::message`, this.message);
    this.socket.on('game::error', this.error);
  },
  methods: {
    start() {
      this.socket.emit('game::start', this.code);
    },
    play() {
      this.socket.emit(`${this.code}::play`);
    },
    played(play) {
      this.plays.push(play);
      if (play.player.id === this.socket.id) this.hasPlayed = play.played;
    },
    joined(players) {
      this.players = players;
    },
    error(message) {
      this.errors.unshift(message);
    },
    message(message) {
      console.log(message);
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
