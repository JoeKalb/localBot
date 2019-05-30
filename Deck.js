
const cards = [2,3,4,5,6,7,8,9,10,'A', 'J', 'Q', 'K']
const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades']
class Deck{
    constructor(){
        this._cards = []
        this._count = 52
    }

    newDeck (){
        this._cards = []
        for(let i=0;i<13;++i){
            for(let j=0;j<4;++j)
                this._cards.push(cards[i])
        }
        this._count = 52
    }

    showDeck(){
        return this._cards
    }

    drawCard(){
        let rand = Math.floor(Math.random() * this._count)
        let card = this._cards.splice(rand,1)
        --this._count;
        return card[0];
    }
}

module.exports = Deck;