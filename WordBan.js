let fs = require('fs')

class WordBan{
    constructor(channel){
        this._channel = channel
        this._file = JSON.parse(fs.readFileSync('WordBan.json'));
        this._players = this._file.players;
        this._word = this._file.wordInfo.word;
        this._wordSaidCount = this._file.wordInfo.wordSaidCount;
        this._wordChatCount = this._file.wordInfo.wordChatCount;
        this._gameOn = this._file.wordInfo.on_game;
    }

    saveAll(){
        this._file = {
            "players":this._players,
            "wordInfo":{
                "word":this._word,
                "wordSaidCount":this._wordSaidCount,
                "wordChatCount":this._wordChatCount,
                "on_game":this._gameOn
            }
        }
        fs.writeFileSync('WordBan.json', JSON.stringify(this._file))
    }

    clear(){
        this._gameOn = false
        this._word = ''
        this._wordSaidCount = 0;
        this._wordChatCount = 0;
        this.saveAll();
    }

    getGameOn(){
        return this._gameOn;
    }

    toggleGameOn(){
        (this._gameOn) ?
            this._gameOn = false:
            this._gameOn = true;
        this.saveAll()
    }

    setGameOnTrue(){
        this._gameOn = true;
        this.saveAll()
        return this._gameOn
    }

    setGameOnFalse(){
        this._gameOn = false;
        this.saveAll()
        return this._gameOn;
    }

    getWord(){
        return this._word
    }

    setWord(newWord){
        this._word = newWord
        this.saveAll()
    }

    getwordChatCount(){
        return this._wordChatCount
    }

    getWordSaidCount(){
        return this._wordSaidCount
    }

    getWordDisplay(){
        return `${this._channel} = ${this._wordSaidCount} | Chat = ${this._wordChatCount}`
    }

    wordCheck(msg){
        const words = msg.split(' ')
        let check = false
        words.forEach(word => {
            check = word.toLowerCase() === this._word
            if(check){
                ++this._wordChatCount;
                this.saveAll()
                return check;
            }
        })
        return check;
    }

    wordStreamerSaid(){
        ++this._wordSaidCount
        this.saveAll()
        return this._wordSaidCount
    }

    editPlayer(name, isPlaying){
        this._players[name] = isPlaying;
        this.saveAll()
        return isPlaying;
    }

    checkPlayer(name){
        return (this._players.hasOwnProperty(name))?
            this._players[name] : false;
    }
}

module.exports = WordBan;