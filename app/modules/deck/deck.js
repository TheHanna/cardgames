class Deck {
  constructor() {
    this.cards = [];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
    suits.forEach((suit) => {
      let cards = ranks.map((rank, index) => {
        return { rank: rank, suit: suit, value: index };
      });
      this.cards = [...this.cards, ...cards];
    });
    this.shuffle();
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

module.exports = Deck;
