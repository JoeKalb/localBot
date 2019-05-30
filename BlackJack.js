let houses = new require('./Houses')
let deck = new require('./Deck')

class BlackJack{
    constructor(channel){
        this._channel = channel
        this._deck = new deck()
        this._players = {}
        this._dealer = []
        this._gameOn = false;

        this._deck.newDeck()
    }

    clear(){
        this._players = {}
        this._dealer = []
        this._gameOn = false;

        this._deck.newDeck()
    }

    getGameOn(){
        return this._gameOn;
    }

    startGame(){
        this._gameOn = true;
    }

    stopGame(){
        this._gameOn = false;
    }

    getChannel(){
        return this._channel
    }

    shuffle(){
        this._deck.newDeck()
    }

    getPlayers(){
        return this._players;
    }

    addPlayer(name, bet){
        if(!this._players.hasOwnProperty(name))
            this._players[name] = {
                'hand':[],
                bet
            }
    }

    deal(){
        let players = Object.keys(this._players)

        for(let i = 0; i < 2; ++i){
            for(let j = 0; j < players.length; ++j){
                this._players[players[j]].hand.push(this._deck.drawCard())
            }
            this._dealer.push(this._deck.drawCard())
        }
    }

    hit(name){
        if(this._players.hasOwnProperty(name) 
        && getHandTotal(this._players[name].hand) <= 21){
            this._players[name].hand.push(this._deck.drawCard())
            return true;
        }
        return false;
    }

    dealerFinal(){
        let currentScore = getHandTotal(this._dealer);
        while(currentScore < 17){
            this._dealer.push(this._deck.drawCard())
            currentScore = getHandTotal(this._dealer)
        }
    }

    playerHand(name){
        return (this._players.hasOwnProperty(name)) ? 
            `${houses.getDisplayName(name)}'s hand: ${this._players[name].hand} Score: ${getHandTotal(this._players[name].hand)} ${(getHandTotal(this._players[name].hand) > 21) ? 'BUST!': `${(getHandTotal(this._players[name].hand) == 21)? 'BLACKJACK!':''}`}` :
            `Sorry ${houses.getDisplayName(name)}, you didn't ante up!`
    }

    dealerHand(){
        return `Dealers current hand: ${this._dealer} Score: ${getHandTotal(this._dealer)}`
    }
}

function getHandTotal(cards){
    let total = 0
    let numOfAces = 0
    for(let card of cards){
        if(card === 'A')
            ++numOfAces
        else if(card === 'J' || card === 'Q' || card === 'K')
            total += 10
        else 
            total += card
    }

    if(numOfAces < 1){
        if(total + 11 + (numOfAces - 1) > 21)
            total += numOfAces
        else
            total += (11 + numOfAces - 1)
    }
    else if(numOfAces == 1){
        if(total + 11 > 21)
            ++total
        else 
            total += 11
    }

    return total
}

module.exports = BlackJack;