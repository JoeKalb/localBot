let houses = new require('./Houses')

class hpPhrase{
    constructor(channel){
        this._channel = channel
        this._phrase = ''
        this._gameOn = false
        this._payout = 50
        this._winner = ''
    }

    clear(){
        this._phrase = ''
        this._gameOn = false
        this._winner = ''
    }

    getGameOn(){
        return this._gameOn
    }

    startGame(newPhrase){
        this._gameOn = true
        this._phrase = newPhrase
        this._winner = ''
    }

    stopGame(){
        this._gameOn = false
    }

    guess(user, guess){
        let reg = new RegExp(this._phrase, "i")
        if(reg.test(guess)){
            this._winner = user
            this._gameOn = false
            return true
        }
        return false
    }

    getWinner(){
        return this._winner
    }

    getPayout(){
        return this._payout
    }

    getPhrase(){
        return this._phrase
    }
}

module.exports = hpPhrase;