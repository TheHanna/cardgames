const debug = require('debug')('cg:mw:games:war');
const Game = require('../base');
const _ = require('lodash');
const Deck = require('./deck');

class War extends Game {
  constructor(server, code) {
    super(server, code);
    this.deck = new Deck();
    this.deck.shuffle();

    _.forEach(this.players, player => {
      debug(player);
    });
  }

  deal() {
    let count = _.keys(this.players).length;
    if (count < 2) return;
    let max = this.count - 1;
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
};

module.exports = {
  game: War,
  ready: function(players) {
    const min = 2;
    const max = 4;
    if (players >= min && players <= max) {
      return true;
    }
    return false;
  }
};
