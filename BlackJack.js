let fs = require('fs')
let disNames = JSON.parse(fs.readFileSync('displayNames.json'))
let deck = new require('./Deck')

class BlackJack{
    constructor(channel){
        this._channel = channel
        this._deck = new deck()
        this._players = {}
        this._dealer = []

        this._deck.newDeck()
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

    addPlayer(name){
        if(!this._players.hasOwnProperty(name))
            this._players[name] = []
    }

    deal(){
        let players = Object.keys(this._players)

        for(let i = 0; i < 2; ++i){
            for(let j = 0; j < players.length; ++j){
                this._players[players[j]].push(this._deck.drawCard())
            }
            this._dealer.push(this._deck.drawCard())
        }
    }

    hit(name){
        if(this._players.hasOwnProperty(name) 
        && getHandTotal(this._players[name]) <= 21){
            this._players[name].push(this._deck.drawCard())
        }
    }

    dealerScore(){
        let currentScore = getHandTotal(this._dealer);
        while(currentScore < 17){
            this._dealer.push(this._deck.drawCard())
            currentScore = getHandTotal(this._dealer)
        }
        console.log(this._dealer)
        console.log(currentScore)
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