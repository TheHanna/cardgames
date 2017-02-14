const debug = require('debug')('cardgames:game:war');
const Base = require('../../base.js');
const Deck = require('../../deck/deck.js');

class War extends Base {
  constructor() {
    debug('War');
    super();
    this.players;
    this.deck = new Deck();
  }
}

module.exports = {
  War: War
};
