let hangman = new require('./Hangman')
let giveaway = new require('./Giveaway')
let puptimeGame = new require('./puptimeGame')
let randNum = new require('./RandNumber')
let quidditch = new require('./Quidditch')
let wizardDuel = new require('./WizardDuel')
let search = new require('./Search')

let backupBot = require('./BackupBot')

const response = {
    hasMessage:false,
    hasDelay:false,
    hasPayout:false,
    isAction:false,
    hasPromise:false,
    items:[]
}

const commandPrefix = '!';

module.exports = {
    channel:"#thabuttress",
    handleMessage: (context, msg) => {
        // all messages will choose to return through this object
        let result = Object.assign({}, response)
        result.items = []

        // backup bot
        if(context.username === 'thabottress' && msg == `I'm up and running.`){
            backupBot.bottressStatusLive();
            return result;
        }

        // hangman logic
        if(!hangman.getPause()){
            if (hangman.isAnswer(msg)) {
                result.hasMessage = true;
                result.hasPayout = true;

                hangman.winner = context['display-name']

                result.items.push(`The winner is ${hangman.winner}! ${hangman.answer}`)
                result.items.push(buttcoinPayout(context['display-name'], 100))

                return result;
            }
            else if (msg.length == 1){
                let letter = msg.toUpperCase();
                let numCount = hangman.isNewLetter(letter)
                if(numCount > 0){
                    result.hasMessage = true;
                    
                    hangman.updateDisplay(letter)

                    result.items.push(`${letter} appears ${numCount} time${(numCount > 1)? 's': ''}!`)
                    hangman.updateDisplay(letter)

                    if(hangman.isDisplayAnswer()){
                        result.hasPayout = true;

                        hangman.winner = context['display-name']

                        result.items.push(`The winner is ${hangman.winner}! ${hangman.answer}`)
                        result.items.push(buttcoinPayout(context['display-name'], 100))

                        return result;
                    }
                    else {
                        result.items.push(`${hangman.display}`)
                        return result
                    }
                }
                else if(numCount == 0){
                    result.items.push(`no ${letter}`)
                    return result
                }
            }
        }

        // puptime logic
        if(puptimeGame.getGameOn())
            puptimeGame.checkMessage(context, msg);

        // giveaway logic
        if(giveaway.allowEntries)
            giveaway.isNewName(context['display-name'])

        // all commands go under here
        if(msg.substr(0,1) !== commandPrefix)
            return result; // not a command

        const parse = msg.slice(1).split(' ')
        const commandName = parse[0]

        // backup bot commands
        if(backupBot.isBottressDown()){
            let message = backupBot.BotHandler('#thabuttress', context.mod, commandName, parse)
            if(message === false)
                return result;

            if(typeof message == "string"){
                result.hasMessage = true;
                result.isAction = true;

                result.items.push(message)
                return result;
            }
            else if(typeof message == 'object'){
                result.hasPromise = true;
                result.hasMessage = true;
                result.isAction = true;
                result.items.push(message)
                return result;
            }
        }

        // hangman commands
        switch(commandName){
            case 'hangman':
                result.hasMessage = true;
                (!hangman.getPause())
                    ? result.items.push(`${hangman.display}`)
                    : result.items.push("Hangman is currently paused!")
                return result;
            case 'guessed':
                if(!hangman.getPause()){
                    result.hasMessage = true;
                    result.items.push(`Letters already guessed: ${hangman.alreadyGuessed()}`)
                    return result;
                }
            default:
        }

        // giveaway commands
        switch(commandName){
            case 'me':
                result.hasMessage = true;
                result.items.push(
                    `${context['display-name']} is${(giveaway.check(context['display-name']) 
                    ? " ": " not ")}in the giveaway! Entries: ${giveaway.count}`)
                return result;
            default:
        }

        // general commands
        switch(commandName){
            case 'test':
                backupBot.checkingBottressStatus();
                return result;
            default:
                console.log(`Command Not Found: ${commandName}`)
                return result;
        }

        // catch any final values and return them
    },
    // commands to handle games
    startHangman: (info) => {
        hangman.start(info)
    },
    getHangmanWordCount: () => {
        let wordCount = hangman.wordCount;
        return wordCount
    },
    getHangmanDisplay: () => {
        let display = hangman.display;
        return display
    },
    getHangmanAnswer:() => {
        let answer = hangman.answer;
        return answer
    },
    getHangmanPause: () => {
        return hangman.getPause();
    },
    toggleHangmanPause: () => {
        (hangman.pause) ? hangman.pause = false 
            : hangman.pause = true;
    },
    clearHangman:() => {
        hangman.clear();
    },
    startGiveaway:() => {
        giveaway.start('thabuttress')
    },
    stopEntries:() => {
        giveaway.stopEntries();
    },
    drawWinner:() => {
        return giveaway.drawWinner()
    },
    getGiveawayCount:() => {
        let count = giveaway.count
        return count
    },
    clearGiveaway:() => {
        giveaway.clear();
    },
    startPuptime:() => {
        puptimeGame.start('thabuttress')
    },
    endPuptime:() => {
        puptimeGame.end()
        let finalPlayers = puptimeGame.getPlayers()
        return finalPlayers;
    },
    clearPuptime:() => {
        puptimeGame.clear();
    },
    buttcoinPayout:(user, amount) => {
        let result = buttcoinPayout(user, amount)
        return result;
    },
    clear:() => {
        hangman.clear();
        puptimeGame.clear();
        giveaway.clear();
        randNum.clear();
    }
}

// helper functions
function buttcoinPayout(user, amount){
    return `!buttcoins add ${user} ${amount}`;
}