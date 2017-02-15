// const debug = require('debug')('cardgames:game:war');
const Deck = require('../../deck/deck.js');

class War {
  constructor() {
    this.players = {};
    this.deck = new Deck();
    this.inPlay = {};
  }

  gameLoop() {
    setInterval(() => {
      console.log('checking game state');
      console.log('all played: ', this.allPlayed);
      if (this.allPlayed) this.compare();
    }, 1000);
  }

  addPlayer(id) {
    this.players[id] = {
      hand: []
    };
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
    let player = this.players[id];
    if (!player) return;
    this.inPlay[id] = player.hand.shift();
  }

  compare() {
    console.log(this.inPlay);
    let keys = Object.keys(this.inPlay);
    let max = keys.reduce((acc, cv, ci, arr) => {
      let curr = this.inPlay[cv].value;
      let prev = this.inPlay[acc].value;
      if (curr > prev) acc = cv;
      return acc;
    });
    console.log(max, this.inPlay[max]);
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
