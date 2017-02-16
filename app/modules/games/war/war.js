const debug = require('debug')('cardgames:game:war');
const _ = require('lodash');
const Deck = require('../../deck/deck.js');

class War {
  constructor() {
    this.players = {};
    this.deck = new Deck();
    this.inPlay = {};
    this.prizePool = [];
  }

  gameLoop() {
    // TODO: Lock down game and room; prevent other players from joining
    this.deal();
    setInterval(() => {
      debug('checking game state');
      debug('all played: ', this.allPlayed);
      debug(this.inPlay);
      if (this.allPlayed) this.determineWinner();
    }, 1000);
  }

  addPlayer(id) {
    this.players[id] = {
      hand: []
    };
    debug(this.playerCount);
    if (this.playerCount === 2) this.gameLoop();
  }

  deal() {
    if (this.playerCount < 2) return;
    let max = this.playerCount - 1;
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

  play(id) {
    // TODO: Add phase attribute to differentiate between regular play and "war" play
    let player = this.players[id];
    if (!player) return;
    this.inPlay[id] = player.hand.shift();
    // TODO: Emit event to display card to player
  }

  determineWinner() {
    let winner = this.winner;
    if (winner) {
      debug(io.sockets.connected[winner].name, 'won!'); // Print winner server side
      this.giveCards();
      // TODO: Emit event to tell player they won
      // TODO: Give cards in play to winning player
    } else {
      debug('WAR!'); // If we picked multiple players, move in to war phase
      // TODO: Move cards "in play" to "prize pool"
      // TODO: Emit event to allow players to play another card
    }
  }

  giveCards() {
    let winner = this.players[this.winner];
    _.forOwn(this.inPlay, (card) => {
      this.prizePool.push(card);
    });
    this.prizePool = _.shuffle(this.prizePool);
    winner.hand = [...winner.hand, ...this.prizePool];
    this.inPlay = {};
    this.prizePool = [];
  }

  get max() {
    let max = -1; // Set max negative to guarantee reset based on card values
    _.forOwn(this.inPlay, (card) => { // Loop through cards in play
      max = (card.value > max) ? card.value : max; // Set max if current card value is greater
    });
    return max;
  }

  get winners() {
    let list = _.pickBy(this.inPlay, (card) => { // Get the players who played cards with values equal to the max value
      return card.value === this.max;
    });
    return _.keys(list); // Return the player socket ID's
  }

  get winner() {
    return (this.winners.length === 1) ? this.winners[0] : null; // If there is one winner, return them, otherwise return null
  }

  get playerCount() {
    return Object.keys(this.players).length;
  }

  get cardCount() {
    return Object.keys(this.inPlay).length;
  }

  get allPlayed() {
    return this.playerCount === this.cardCount;
  }

  getPlayerByIndex(index) {
    return this.players[Object.keys(this.players)[index]];
  }
}

module.exports = War;
