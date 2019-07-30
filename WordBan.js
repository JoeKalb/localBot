let fs = require('fs')

class WordBan{
    constructor(channel){
        this._channel = channel
        this._file = JSON.parse(fs.readFileSync(`./gameFiles/${channel}/WordBan.json`));
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
            "players":this._players,
            "played":this._played,
            "wordInfo":{
                "word":this._word,
                "wordSaidCount":this._wordSaidCount,
                "wordChatCount":this._wordChatCount,
                "on_game":this._gameOn,
                "hard":this._hard
            }
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
        if(this._hard){
            let reg = new RegExp(this._word, "i")
            if(reg.test(msg)){
                ++this._wordChatCount;
                this.saveAll()
                return true;
            }
            return false;
        }
        else{
            const words = msg.split(' ')
            let check = false
            words.forEach(word => {
                let reg = /[\W_]/gi
                word = word.replace(reg, '');
                check = word.toLowerCase() === this._word
                if(check){
                    ++this._wordChatCount;
                    this.saveAll()
                    return check;
                }
            })
            return check;
        }
    }

    wordStreamerSaid(num=1){
        this._wordSaidCount += num
        this.saveAll()
        return this._wordSaidCount
    }

    wordStreamerSaidDecrease(num=1){
        this._wordSaidCount -= num
        this.saveAll()
        return this._wordSaidCount
    }

    chatterInGame(name){
        if(!this._played.hasOwnProperty(name)){
            this._played[name] = 0
            this.saveAll()
        }
    }

    chatterSaidWord(name){
        ++this._played[name];
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
}

module.exports = WordBan;