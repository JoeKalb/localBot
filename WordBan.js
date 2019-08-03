let fs = require('fs')

class WordBan{
    constructor(channel){
        this._channel = channel
        this._file = JSON.parse(fs.readFileSync(`./gameFiles/${channel}/WordBan.json`)) || {
                "players":{},
                "played":{},
                "wordInfo":{
                    "word":"",
                    "wordSaidCount":0,
                    "wordChatCount":0,
                    "on_game":false,
                    "hard":false
                }
            }
        this._players = this._file.players;
        this._played = this._file.played;
        this._word = this._file.wordInfo.word;
        this._wordSaidCount = this._file.wordInfo.wordSaidCount;
        this._wordChatCount = this._file.wordInfo.wordChatCount;
        this._gameOn = this._file.wordInfo.on_game;
        this._hard = this._file.wordInfo.hard || false;
    }

    saveAll(){
        this._file = {
            "wordInfo":{
                "word":this._word,
                "wordSaidCount":this._wordSaidCount,
                "wordChatCount":this._wordChatCount,
                "on_game":this._gameOn,
                "hard":this._hard
            },
            "played":this._played,
            "players":this._players
        }
        fs.writeFileSync(`./gameFiles/${this._channel}/WordBan.json`, JSON.stringify(this._file))
    }

    clear(){
        this._gameOn = false
        this._word = ''
        this._wordSaidCount = 0;
        this._wordChatCount = 0;
        this._played = {}
        this._hard = false;
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

    getWordChatCount(){
        return this._wordChatCount
    }

    getWordSaidCount(){
        return this._wordSaidCount
    }

    getScoreDisplay(){
        return `${this._channel} = ${this._wordSaidCount} | Chat = ${this._wordChatCount}`
    }

    wordCheck(msg){
        let count = 0;

        if(this._hard){
            let reg = new RegExp(this._word, "i")
            msg = msg.replace(/ /gi, '')

            const msgLoop = msg.length - this._word.length + 1

            let i = 0
            while(i < msgLoop){
                if(reg.test(msg.substring(i, i+this._word.length))){
                    i += this._word.length
                    ++count
                    ++this._wordChatCount
                }
                else ++i
            }
        }
        else{
            const words = msg.split(' ')
            for(let word of words){
                let reg = /[\W_]/gi
                word = word.replace(reg, '')
                if(word.toLowerCase() === this._word){
                    ++count
                    ++this._wordChatCount
                }
            }
        }
        this.saveAll()
        return count
    }

    wordStreamerSaid(num=1){
        this._wordSaidCount += num
        this.saveAll()
        return this._wordSaidCount
    }

    wordStreamerSaidDecrease(num=1){
        this._wordSaidCount -= num
        if(this._wordSaidCount < 0)
            this._wordSaidCount = 0
        this.saveAll()
        return this._wordSaidCount
    }

    chatterInGame(name){
        if(!this._played.hasOwnProperty(name)){
            this._played[name] = 0
            this.saveAll()
        }
    }

    chatterSaidWord(name, num=1){
        this._played[name] += num;
        this.saveAll();
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

    getLevel(){
        return this._hard
    }

    setLevelHard(){
        this._hard = true;
        this.saveAll()
    }

    setLevelEasy(){
        this._hard = false;
        this.saveAll()
    }

    getPlayed(){
        return this._played
    }
}

module.exports = WordBan;