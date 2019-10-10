let hangman = new require('./Hangman')
let giveaway = new require('./Giveaway')
let puptimeGame = new require('./puptimeGame')
let randNum = new require('./RandNumber')
let quidditch = new require('./Quidditch')
let wizardDuel = new require('./WizardDuel')
let search = new require('./Search')
let blackJack = new require('./BlackJack')
let WordBan = new require('./WordBan')
let fetch = require('node-fetch')

let dogbets = require('./dogbets')
let backupBot = require('./BackupBot')
const trivia = require('./Trivia')

let blackJackGame = new blackJack('thabuttress')
let triviaGame = new trivia('thabuttress')
console.log(triviaGame.token)

let wordBanGame = new WordBan('thabuttress')

const fs = require('fs')

const response = {
    hasMessage:false,
    hasDelay:false,
    hasPayout:false,
    hasMultiPayout:false,
    isAction:false,
    hasPromise:false,
    timedMessage:0,
    items:[]
}

const commandPrefix = '!';
const gamePrefix = '#';
const standardPayout = 100;
const channelName = 'thabuttress';
const userID = '82523255';

module.exports = {
    channel:"#thabuttress",
    bot:"thabottress",
    handleMessage: (context, msg) => {
        // all messages will choose to return through this object
        let result = Object.assign({}, response)
        result.items = []

        // backup bot
        if(context.username === 'thabottress' && msg == `I'm up and running.`){
            backupBot.bottressStatusLive();
            return result;
        }

        if(context.username === 'thabottress'){
            dogbets.placeBet(msg);
            return result;
        }

        let regexChainmail = /chain( )*mail/i 
        if(regexChainmail.test(msg)){
            /* result.hasMessage = true;
            result.items.push(
                `${buttcoinRemove(context['display-name'], 10)} Reason: chainmail is the banned word of the day!`)
            
            return result; */
            console.log(`Chainmail was said by ${context['display-name']}`)
        }

        // hangman logic
        if(!hangman.getPause()){
            if (hangman.isAnswer(msg)) {
                result.hasMessage = true;
                result.hasPayout = true;

                hangman.winner = context['display-name']

                result.items = [...result.items,
                    `The winner is ${hangman.winner}! ${hangman.answer}`,
                    buttcoinPayout(context['display-name'], standardPayout)]
                
                return result;
            }
            else if (msg.length == 1){
                let letter = msg.toUpperCase();
                let numCount = hangman.isNewLetter(letter, context.username)
                if(numCount > 0){
                    result.hasMessage = true;
                    
                    hangman.updateDisplay(letter)

                    //result.items = [...result.items, `${letter} appears ${numCount} time${(numCount > 1)? 's': ''}!`] //shows the number of letters found
                    hangman.updateDisplay(letter)

                    if(hangman.isDisplayAnswer()){
                        result.hasPayout = true;

                        hangman.winner = context['display-name']

                        result.items = [...result.items,
                            `The winner is ${hangman.winner}! ${hangman.answer}`,
                            buttcoinPayout(context['display-name'], standardPayout)]

                        return result;
                    }
                    else {
                        result.items = [...result.items, `${hangman.display}`]
                        return result
                    }
                }
                else if(numCount == 0){
                    result.hasMessage = true
                    result.items = [...result.items, `no ${letter}`]
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
                    result.items = [...result.items, randNumWinDisplay]

                result.items = [...result.items, buttcoinPayout(context['display-name'], standardPayout)]

                return result;
            }
        }

        // trivia game logic
        if(triviaGame.play && msg.length === 1){
            triviaGame.answerSubmitted(context.username, msg)
        }

        // wordban game logic
        if(wordBanGame.getGameOn() && wordBanGame.checkPlayer(context.username)){
            wordBanGame.chatterInGame(context.username)
            let wordCount = wordBanGame.wordCheck(msg)
            if(wordCount > 0){
                wordBanGame.chatterSaidWord(context.username, wordCount)
                result.hasMessage = true;
                result.items = [
                    `${buttcoinRemove(context.username, 5*wordCount)} You said the banned word "${wordBanGame.getWord()}" ${(wordCount > 1) ? 
                        `${wordCount} times`:`in your last message`}!`
                ]
                updateStreamDisplay(`Banned Word: ${wordBanGame.getWord()}`, 60, 'white')
                //return result;
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
            let message = backupBot.BotHandler('#thabuttress', (context.username === 'thabuttress')?
                true:context.mod, commandName, parse, context)

            if(typeof message == "string"){
                result.hasMessage = true;
                result.isAction = true;

                result.items = [...result.items, message]
                return result;
            }
            else if(typeof message == 'object'){
                result.hasPromise = true;
                result.hasMessage = true;
                result.isAction = true;
                result.items = [...result.items, message]
                return result;
            }
            else if(message === false)
                console.log('Backup Command Not Found')
        }

        // wordban commands
        switch(commandName){
            case 'join':
                wordBanGame.editPlayer(context.username, true)
                result.hasMessage = true;
                result.items = [
                    ...result.items,
                    `${context['display-name']} has opted into${(wordBanGame.getGameOn())? ' this current and':''} future word ban games. Do !leave if you don't want to play.`
                ]
                return result;
            case 'leave':
                wordBanGame.editPlayer(context.username, false)
                result.hasMessage = true;
                result.items = [
                    ...result.items,
                    `${context['display-name']} has opted out of the word ban.`
                ]
                return result;
            case 'wordban':
                result.hasMessage = true;
                result.items = [
                    ...result.items,
                    `Redeem a ban word in the Streamlabs Extension for Butt and Chat. Saying the word in the chat will lose you buttcoins but if Butt ends up saying the banned word more, then all of chat will get a payout! Commands: !join the wordban game| !leave the wordban game | !score to see what the current points are`
                ]
                return result;
            case 'score':
                result.hasMessage = true;
                result.items = [
                    ...result.items,
                    wordBanGame.getScoreDisplay()
                ]
                return result
            default:
        }

        // trivia commands
        switch(commandName){
            case 'currentQ':
                if(trivia.play){
                    result.hasMessage = true;
                    result.items = [trivia.getCurrentQuestion()]
                    return result;
                }
            default:
        }

        // dog bets commands!
        switch(commandName){
            case 'mybets':
                let bets = (parse.length == 1) ?
                    dogbets.showBets(context.username) : dogbets.showBets(parse[1].toLowerCase())
                if(bets){
                    result.hasMessage = true;
                    result.isAction = true;
                    result.items = [... result.items, bets];
                    return result;
                }
            case 'pups':
                result.hasMessage = true;
                result.isAction = true;
                result.items = [...result.items, dogbets.winnings(context.username)]
                return result;
            default:
        }
        
        // hangman commands
        switch(commandName){
            case 'hangman':
                result.hasMessage = true;
                (!hangman.getPause())
                    ? result.items = [...result.items, `${hangman.display}`]
                    : result.items = [...result.items, "Hangman is currently paused!"]
                return result;
            case 'guesses':
                if(!hangman.getPause()){
                    result.hasMessage = true;
                    result.items = [...result.items, `Letters already guessed: ${hangman.alreadyGuessed()}`]
                    return result;
                }
            default:
        }

        // giveaway commands
        switch(commandName){
            case 'me':
                result.hasMessage = true;
                result.items = [...result.items, 
                    `${context['display-name']} is${(giveaway.check(context['display-name']) 
                    ? " ": " not ")}in the giveaway! Entries: ${giveaway.count}`]
                return result;
            default:
        }

        // randNum commands
        switch(commandName){
            case 'number':
                if(randNum.allowGuesses){
                    result.hasMessage = true;
                    result.items = [...result.items, `Guess a number between 1 and ${randNum.upper}`]
                    return result;
                }
            default:
        }

        //blackjack commands
        if(blackJackGame.getGameOn()){
            switch(commandName){
                case 'ante':
                    let bet = (parse.length > 1) ? (parse[1] > 100? 100 : parse[1]) : 10
                    blackJackGame.addPlayer(context.username, bet)
                    return result;
                case 'hand':
                    result.items = [blackJackGame.playerHand(context.username)]
                    result.hasMessage = true;
                    return result
                case 'hit':
                    if(blackJackGame.hit(context.username)){
                        result.items = [blackJackGame.playerHand(context.username)]
                        result.hasMessage = true;
                        return result;
                    }
                default:
            }
        }

        //trivia submit answer
        if(triviaGame.play 
            && triviaGame.isAnswerInRange(parseInt(commandName))){
            triviaGame.answerSubmitted(context.username, parseInt(commandName))
        }

        //game start and ending mod commands
        if(context.mod || `#${context.username}` == this.channel || context.username === channelName
            || context.username === 'minovskyflight'){
            switch(commandName){
                case 'clear':
                    result.hasMessage = true;
                    result.items = [...result.items, 'Clearing Stream Display']
                    updateStreamDisplay('', 100, 'white')
                    return result;
                case 'wordset':
                    if(parse[1]){
                        wordBanGame.setWord(parse[1].toLowerCase())
                        result.hasMessage = true;
                        result.items = [
                            `Banned Word: ${wordBanGame.getWord()}`
                        ]
                        updateStreamDisplay(`Banned Word: ${wordBanGame.getWord()}`, 60, 'white')
                        wordBanGame.setGameOnTrue()
                        return result;
                    }
                case 'wordclear':
                    wordBanGame.clear()
                    console.log('wordgame cleared')
                    return result;
                case 'said':
                    if(wordBanGame.getGameOn()){
                        (parse[1])?
                            wordBanGame.wordStreamerSaid(parseInt(parse[1])) :
                            wordBanGame.wordStreamerSaid()
                    }
                    updateStreamDisplay(wordBanGame.getScoreDisplay(), 60, 'white')
                    setTimeout(() => {
                        updateStreamDisplay(`Banned Word: ${wordBanGame.getWord()}`, 60, 'white')
                    }, 10000)
                    return result;
                case 'unsaid':
                    if(wordBanGame.getGameOn()){
                        (parse[1])?
                            wordBanGame.wordStreamerSaidDecrease(parseInt(parse[1])) :
                            wordBanGame.wordStreamerSaidDecrease()
                    }
                    updateStreamDisplay(wordBanGame.getScoreDisplay(), 60, 'white')
                    setTimeout(() => {
                        updateStreamDisplay(`Banned Word: ${wordBanGame.getWord()}`, 60, 'white')
                    }, 5000)
                    return result;
                case 'wordhard':
                    wordBanGame.setLevelHard()
                    return result;
                case 'wordeasy':
                    wordBanGame.setLevelEasy()
                    return result;
                case 'wordcheck':
                    result.hasMessage = true;
                    if(wordBanGame.checkPlayer(parse[1].replace('@','').toLowerCase())){
                        result.items = [`${parse[1]} is playing the wordban game.`]
                    }
                    else{
                        result.items = [`${parse[1]} isn't playing the wordban game.`]
                    }
                    return result;
                case 'wordend':
                    wordBanGame.setGameOnFalse()
                    
                    const buttScore = wordBanGame.getWordSaidCount()
                    const chatScore = wordBanGame.getWordChatCount()
                    const diffScore = Math.abs(buttScore - chatScore)

                    result.hasMessage = true;
                    result.items = [
                        `Final Score for WordBan: ${wordBanGame.getScoreDisplay()}`
                    ]

                    if(buttScore > chatScore){
                        result.hasMultiPayout = true;
                        result.items[0] = 
                            `${result.items[0]} CHAT WINS! buttHype`

                        let played = wordBanGame.getPlayed()

                        Object.keys(played).forEach(name => {
                            result.items = [
                                ...result.items,
                                buttcoinPayout(name, diffScore * 5)
                            ]
                        })
                    }
                    else if(chatScore > buttScore){
                        result.hasMultiPayout = true;
                        result.items[0] = 
                            `${result.items[0]} BUTT WINS! buttSmug`

                        let played = wordBanGame.getPlayed()

                        Object.keys(played).forEach(name => {
                            if(played[name] > 0){
                                result.items = [
                                    ...result.items,
                                    buttcoinRemove(name, played[name] * 5)
                                ]
                            }
                        })
                    }
                    else{ // diffScore = 0
                        result.items[0] = 
                            `${result.items[0]} No one wins buttThump`
                    }

                    wordBanGame.clear()

                    return result;
                case 'refresh':{
                    updateStreamDisplay(`Banned Word: ${wordBanGame.getWord()}`, 60, 'white')
                }
                case'startpuptime':
                    puptimeGame.start('thabuttress')
                    result.hasMessage = true;
                    result.items = [...result.items, `Let's play the puptime game! Get puptime to use the buttMonty or buttReggie and you can win buttcoins!`]
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
                        
                        result.items = [...result.items, topDisplay]

                        for(let payout of payoutStrings)
                            result.items = [...result.items, payout]
                    }
                    else{
                        result.hasMessage = true;
                        result.items = [...result.items, `The puptime game has ended and no one has won buttThump`]
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
                    result.items = [...result.items, `Guess a number between 1 and ${upper}`]

                    console.log(`Correct Number ${randNum.number}`)
                    return result;
                case 'endrandom':
                    if(randNum.allowGuesses){
                        result.hasMessage = true;
                        result.isAction = true;

                        for(let i = 0; i < 3; ++i)
                            result.items = [...result.items, `The game has ended and no one guessed the correct answer: ${randNum.number} buttThump`]

                        randNum.clear();
                        return result;
                    }
                case 'startblackjack':
                    console.log('Blackjack game started')
                    blackJackGame.clear()
                    blackJackGame.startGame()
                    result.hasMessage = true;
                    result.items = [...result.items, 'Want to play some blackjack? Do !ante to join (10 buttcoin minimum, 100 buttcoin maximum Ex. !ante 100)']
                    return result;
                case 'deal':
                    if(blackJackGame.getGameOn()){
                        blackJackGame.deal()
                        result.hasMessage = true;
                        result.hasDelay = true;
                        result.isAction = true;
                        result.items = ['All players have been dealt their cards!', blackJackGame.dealerHand()]
                    }
                    return result;
                case 'stopblackjack':
                    blackJackGame.stopGame()
                    blackJackGame.dealerFinal()
                    result.hasMessage = true;
                    result.isAction = true;
                    result.items = [...result.items, blackJackGame.dealerHand()]
                    return result;
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
    whisperHandler:(msg) => {
        if(msg.substr(0,1) !== commandPrefix)
            return false; // not a command

        const parse = msg.slice(1).split(' ')
        const commandName = parse[0]

        if(parse.length < 2) return false

        switch(commandName){
            case 'hangman':{
                const info = parse.slice(1).join(' ').toUpperCase()
                this.startHangman(info)
                return `Hangman Started: ${info}`
            }
            default:
                return false;
        }
    },
    cheerHandler:(userstate, msg) => {
        //console.log(userstate)
        //console.log(msg)
    },
    subHandler: (username, method, message, userstate) => {
        let result = Object.assign({}, response)
        if(username === 'joefish5') return result;
        
        result.hasMessage = true;
        result.items = ['buttHella buttHype buttHella buttHype buttHella buttHype buttHella buttHype buttHella buttHype buttHella buttHype']
        return result;
    },
    subGiftHandler: (username, methods, userstate) => {
        let result = Object.assign({}, response)
        if(mysterySubGifters.hasProperty(username) && mysterySubGifters[username] > 0)
            --mysterySubGifters[username];
        else if(mysterySubGifters[username] === 0){
            delete mysterySubGifters[username]
        }
        else{
            result.hasMessage = true;
            result.hasPayout = true;

            result.items = [
                'buttHella buttHype buttHella buttHype buttHella buttHype buttHella buttHype buttHella buttHype buttHella buttHype',
                singleGiftPayout(username, methods)
            ]
        } 

        return result
    },
    subMysteryGiftHandler: (username, numbOfSubs, methods, userstate) => {
        (mysterySubGifters.hasProperty(username))?
            mysterySubGifters[username] += numbOfSubs :
            mysterySubGifters[username] = numbOfSubs

        let result = Object.assign({}, response)
        result.hasMessage = true;
        result.hasPayout = true;

        let hype = 'buttHella buttHype '
        result.items = [
            (numbOfSubs > 13) ? hype.repeat(Math.floor(numbOfSubs/2)) : 
            'buttHella buttHype buttHella buttHype buttHella buttHype buttHella buttHype buttHella buttHype buttHella buttHype',
            multiGiftPayout(username, numbOfSubs, methods)
        ]
        return result;
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
    eachWordLength:() => {
        let result = hangman.eachWordLength(hangman.answer);
        return result;
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
    startTrivia:(data) => {
        triviaGame.getQuestions(data.amount, data.category)
    },
    nextQuestion:() => {
        triviaGame.nextQuestion();
    },
    getCurrentQuestion: () => {
        return triviaGame.getCurrentQuestion();
    },
    wordBanInc:() => {
        if(wordBanGame.getGameOn()){
            wordBanGame.wordStreamerSaid()
            return true;
        }
        return false
    },
    wordBanDec:() => {
        if(wordBanGame.getGameOn()){
            wordBanGame.wordStreamerSaidDecrease()
            return true;
        }
        return false;
    },
    clear:() => {
        hangman.clear();
        puptimeGame.clear();
        giveaway.clear();
        randNum.clear();
        blackJackGame.clear();
        wordBanGame.clear();
    }
}

let mysterySubGifters = {}

// helper functions
function buttcoinPayout(user, amount){
    return `!buttcoins add ${user} ${amount}`;
}

function buttcoinRemove(user, amount){
    return `!buttcoins remove ${user} ${amount}`
}

function singleGiftPayout(user, methods){
    const plan = parseInt(methods.plan) / 1000;
    let value = 25
    if(plan === 2)
        value = 50
    else if(plan === 3)
        value = 125
    return buttcoinPayout(user, value)
}

function multiGiftPayout(user, numOfSubs, methods){
    const plan = parseInt(methods.plan) / 1000;
    let value = 25
    if(plan === 2)
        value = 50
    else if(plan === 3)
        value = 125
    return buttcoinPayout(user, numOfSubs * value)
}

let updateStreamDisplay = async (value, font, color) => {
    const body = JSON.stringify({
        value,
        font,
        color
    })
    let res = await fetch(`https://buttress-live-display.herokuapp.com?password=${channelName}`, {
        method:"POST",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body
    })
    let json = await res.json()
    console.log(json)
}

const CLIENT_ID = 'q9qpitg0qv8dujukht7g581ds0n5hx'

let getStreamData = async (arr) => {
    try{
        let allUserIDs = `user_id=${arr[0]}`

        if(arr.length <= 100){
            for(let i = 1; i < arr.length; ++i)
                allUserIDs += `&user_id=${arr[i]}`
        
            let res = await fetch(`https://api.twitch.tv/helix/streams?${allUserIDs}`, {
                headers:{
                    'Client-ID':`${CLIENT_ID}`,
                    'Accept':'application/vnd.twitchtv.v5+json'
                }
            })
            let json = await res.json()
            return json.data;
        }
        else{
            const calls = Math.ceil(arr.length/100)
            let allUserIDsArr = new Array(calls)

            for(let i = 0; i < calls; ++i){
                let idCall = ''

                const length = (i === calls - 1) 
                    ? arr.length%100 : (i*100) + 100
                for(let j = i*100; j < length; ++j){
                    idCall += `user_id=${arr[j]}&`
                }

                allUserIDsArr[i] = idCall
            }

            let data = []

            for(let i = 0; i < calls; ++i){
                try{
                    let res = await fetch(`https://api.twitch.tv/helix/streams?${allUserIDsArr[i]}`, {
                        headers:{
                            'Client-ID':`${CLIENT_ID}`,
                            'Accept':'application/vnd.twitchtv.v5+json'
                        }
                    })

                    let json = await res.json()

                    if(json.data.length > 0)
                        data = [...data, ...json.data]
                }
                catch(err){
                    console.log(err)
                }
            }

            return data;
        }
        
    }
    catch(err){
        console.log(err)
        return false;
    }
}

let getTwitchStaffTeamIDArr = async () => {
    try{
        let res = await fetch(`https://api.twitch.tv/kraken/teams/staff`, {
            headers:{
                'Client-ID':`${CLIENT_ID}`,
                'Accept':'application/vnd.twitchtv.v5+json'
            }
        })
        let json = await res.json()
    
        let result = []
    
        for(let i = 0; i < json.users.length; ++i)
            result = [...result, json.users[i]._id]
    
        return result;
    }
    catch(err){
        console.log(err)
        return false;
    }
}

/* (async() => {
    let streamInfo = await getStreamData([userID])
    console.log(streamInfo)
    if(streamInfo.length > 0){
        return
    }
    let arr = await getTwitchStaffTeamIDArr()
    let result = await getStreamData(arr)
    for(let stream of result)
        console.log(stream.user_name)
})(); */