class Deck {
  constructor() {
    this.cards = [];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
    suits.forEach((suit) => {
      let cards = ranks.map((rank) => {
        return { rank: rank, suit: suit };
      });
      this.cards = [...cards];
      console.log(this.cards);
      // this.cards.push.apply(this.cards, cards);
    });
  }

  shuffle() {
    let m = this.cards.length,
        t, i;

    while (m) {
      i = Math.floor(Math.random() * m--);
      t = this.cards[m];
      this.cards[m] = this.cards[i];
      this.cards[i] = t;
    }
  }
}

module.exports = {
  Deck: Deck
};
