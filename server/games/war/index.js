const debug = require('debug')('cg:mw:games:war');
const Game = require('../base');
const _ = require('lodash');
const Deck = require('./deck');
const validate = require('./middleware');

class War extends Game {
  constructor(server, code) {
    super(server, code);
    this.deck = new Deck();
    this.deck.shuffle();
    this.prize = [];
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
    client.use(validate(this.code));
    client.on('game::play', () => {
      this.play(player);
      this.compare();
    });
  }

  start() {
    this.deal();
    _.forEach(this.players, player => {
      player.client.emit('game::started', player.hand.length);
    });
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
    let target = (facing === 'up') ? this.played : this.prize;
    let play = {
      player: { name: player.client.name, id: player.client.id },
      card: player.hand.shift(),
      facing: facing,
      played: true
    };
    target.push(play);
    this.server.to(this.code).emit('game::played', play);
  }

  allPlayed(players) {
    return _.isEqual(
      this.played.map(play => play.player.id).sort(),
      _.keys(players).sort()
    );
  }

  compare(players = this.players) {
    if (!this.allPlayed(players)) return;
    if (this.victory) {
      let winner = this.victor;
      this.server.to(this.code).emit('game::message', `${winner.client.name} won!`);
      this.spoils(winner);
      this.server.to(this.code).emit('game::battle::resolved', this.hands);
    } else {
      let winners = this.getPlayers(this.victor);
      this.server.to(this.code).emit('game::message', 'War!');
      if (this.canWageWar(winners)) {
        this.prize = [...this.prize, ..._.map(this.played)];
        this.played = [];
        this.wageWar(winners);
        this.compare(winners);
      }
    }
  }

  wageWar(players) {
    _.forEach(players, player => {
      this.play(player, 'down');
      player.client.emit('game::war::wagered');
    });
  }

  spoils(winner) {
    winner.hand = [
      ...winner.hand,
      ..._.shuffle([
        ..._.map(this.prize, 'card'),
        ..._.map(this.played, 'card')
      ])
    ];
    this.prize = [];
    this.played = [];
  }

  get victory() {
    return !_.isArray(this.victor);
  }

  get victor() {
    let max = _.get(_.maxBy(this.played, 'card.value'), 'card.value');
    let won = _.filter(this.played, play => play.card.value === max);
    debug(won.length);
    return (won.length === 1)
      ? this.getPlayer(won[0].player.id)
      : _.map(won, winner => winner.player.id);
  }

  canWageWar(players) {
    return _.every(players, player => player.hand.length > 2);
  }

  get hands() {
    let hands = [];
    _.forEach(this.players, player => {
      hands.push({owner: player.client.id, size: player.hand.length});
    });
    return hands;
  }
};

module.exports = {
  name: 'War',
  game: War,
  ready: function(players) {
    return _.inRange(players, 2, 5);
  }
};
