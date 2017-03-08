const debug = require('debug')('cg:mw:games:war');
const Game = require('../base');
const _ = require('lodash');
const Deck = require('./deck');

class War extends Game {
  constructor(server, code) {
    super(server, code);
    this.deck = new Deck();
    this.deck.shuffle();
    this.played = [];

    this.init();
  }

  init() {
    _.forEach(this.players, player => {
      player.hand = [];
      this.events(player);
    });
    this.start();
  }

  events(player) {
    let client = player.client;
    let c = strings => this.code + strings.join();
    client.on(c`::play`, () => {
      let play = this.play(player);
      client.emit(c`::played`, play);
      client.to(c``).emit(c`::played`, play);
    });
  }

  start() {
    this.deal();
    this.loop();
  }

  loop() {
    setInterval(() => {
      this.compare();
    }, 1000);
  }

  deal() {
    let count = _.keys(this.players).length;
    if (count < 2) return;
    let max = count - 1;
    let target = 0;
    while(this.deck.cards.length > 0) {
      let player = this.getPlayerByIndex(target);
      player.hand.push(this.deck.cards.shift());
      if (target < max) {
        target++;
      } else if (target === max) {
        target = 0;
      }
    }
  }

  play(player, facing = 'up') {
    let play = {};
    play.player = { name: player.client.name, id: player.client.id };
    play.card = player.hand.shift();
    play.facing = facing;
    play.played = true;
    this.played.push(play);
    return play;
  }

  allPlayed() {
    return _.isEqual(
      this.played.map(play => play.player.id).sort(),
      _.keys(this.players).sort()
    );
  }

  compare() {
    if (this.allPlayed()) {
      let max = _.get(_.maxBy(this.played, 'card.value'), 'card.value');
      let won = this.played.filter(play => play.card.value === max);
      if (won.length === 1) {
        let winner = won[0];
        let player = this.players[winner.player.id];
        let newHand;
        debug(winner.player.name, 'won!');
        _.shuffle(this.played);
        newHand = [...player.hand, ...this.played];
        player.hand = newHand;
        this.played = [];
        // TODO: figure out why message isn't getting to game creator
        player.client.emit(`${this.code}::message`, 'You won!');
        this.server.to(this.code).emit(`${this.code}::message`, `${winner.player.name} won!`);
      } else if (won.length > 1) {
        debug('WAR!');
      }
    }
  }
};

module.exports = {
  game: War,
  ready: function(players) {
    return _.inRange(players, 2, 4);
  }
};
