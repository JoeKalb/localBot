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
    hasMultiPayout:false,
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
                    result.hasMessage = true
                    result.items.push(`no ${letter}`)
                    return result
                }
            }
        }

        // puptime logic
        if(puptimeGame.getGameOn())
            puptimeGame.checkMessage(context, msg);

        // random number logic
        if(randNum.allowGuesses){
            if(randNum.guess(msg)){
                let randNumWinDisplay = `${context['display-name']} wins! The correct number was ${randNum.number}`
                result.hasMessage = true;
                result.hasPayout = true;
                result.isAction = true;

                for(let i = 0; i < 3; ++i)
                    result.items.push(randNumWinDisplay)

                result.items.push(buttcoinPayout(context['display-name'], 100))

                return result;
            }
        }

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
            case 'guesses':
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

        // randNum commands
        switch(commandName){
            case 'number':
                if(randNum.allowGuesses){
                    result.hasMessage = true;
                    result.items.push(`Guess a number between 1 and ${randNum.upper}`)
                    return result;
                }
            default:
        }

        // game start and ending mod commands
        if(context.mod || `#${context.username}` == this.channel){
            switch(commandName){
                case'startpuptime':
                    puptimeGame.start('thabuttress')
                    result.hasMessage = true;
                    result.items.push(`Let's play the puptime game! Get puptime to use the buttMonty or buttReggie and you can win buttcoins!`)
                    return result;
                case 'endpuptime':
                    puptimeGame.end()
                    let payouts = puptimeGame.getPlayers()

                    let names = Object.keys(payouts)

                    if(names.length > 0){
                        let payoutStrings = []

                        let topNames = [names[0]]
                        let topScore = payouts[names[0]]
                    
                        for(let name of names){
                            if(topScore == payouts[name] && topNames[0] != name)
                            topNames.push(name)
                            else if(topScore < payouts[name]){
                            topScore = payouts[name]
                            topNames = [name]
                            }
                            payoutStrings.push(buttcoinPayout(name, payouts[name]))
                        }
                    
                        let topDisplay = `Top Score: ${topScore} ${topNames}`

                        result.hasMessage = true;
                        result.hasMultiPayout = true;
                        
                        result.items.push(topDisplay)

                        for(let payout of payoutStrings)
                            result.items.push(payout)
                    }
                    else{
                        result.hasMessage = true;
                        result.items.push(`The puptime game has ended and no one has won buttThump`)
                    }
                    return result;
                case 'startrandom':
                    let upper = 100;
                    if(parse[1]){
                        try{
                            upper = parseInt(parse[1])
                        }
                        catch(err){
                            console.log(`Problem trying to parse ${parse[1]}`)
                            console.log(err)
                            upper = 100;
                        }
                    }

                    randNum.start(upper, this.channel)

                    result.hasMessage = true;
                    result.isAction = true;
                    result.items.push(`Guess a number between 1 and ${upper}`)

                    console.log(`Correct Number ${randNum.number}`)
                    return result;
                case 'endrandom':
                    if(randNum.allowGuesses){
                        result.hasMessage = true;
                        result.isAction = true;

                        for(let i = 0; i < 3; ++i)
                            result.items.push(`The game has ended and no one guessed the correct answer: ${randNum.number} buttThump`)

                        randNum.clear();
                        return result;
                    }
                default:
            }
        }

        // general commands
        switch(commandName){
            case 'test':
                backupBot.checkingBottressStatus();
                return result;
            default:
                //console.log(`Command Not Found: ${commandName}`)
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
    startRandNum:(upper) => {
        randNum.start(upper, this.channel)
    },
    getRandNumAnswer:() => {
        let answer = 0
        if(randNum.allowGuesses)
            answer = randNum.number
        
        return answer
    },
    clearRandNum:() => {
        randNum.clear()
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