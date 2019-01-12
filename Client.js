const tmi = require('tmi.js')
const co = require('co');
let hangman = require('./Hangman')
let giveaway = require('./Giveaway') 
let randNum = require('./RandNumber')
let quidditch = require('./Quidditch')
let wizardDuel = require('./WizardDuel')
const fs = require('fs');
const houses = require('./Houses')
let CONFIG;

let backupBot = require('./BackupBot')


if(process.env.OAUTH === undefined) {
  let localConfig = require('./config.js')
  CONFIG = localConfig.CONFIG;
}

// create file for logging
let today = new Date();
let fileName = `logs/${today.getUTCMonth()+1}-${today.getUTCDate()}.txt`;

function recordPayouts(message){
  fs.appendFile(fileName, `\n${message}`, (err) => {
    if(err) throw err;
    console.log(`Saved message: ${message}`)
  })
}
function recordHousePoints(message){
  fs.appendFile(fileName, ` | ${message}`, (err) => {
    if(err) throw err;
    console.log(`Saved message: ${message}`)
  })
}

// Valid commands start with:
let commandPrefix = '!'

// Define configuration options:
let opts = {
   identity: {
    username: 'JoeFish5',
    password: CONFIG.OAUTH
   },
   channels: [
    'thabuttress',
    'joefish5',
    'oooskittles',
    'thethingssheplays',
   ]
}

let playMarbelsSkoots = true;
let playMarbelsMop = true;

// Create a client with our options:
let client = new tmi.client(opts)

client.getChannels = () => {
  return opts.channels
}

// Register our event handlers (defined below):
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)
client.on('disconnected', onDisconnectedHandler)

// Connect to Twitch:
client.connect()

// Called every time a message comes in:
function onMessageHandler (target, context, msg, self) {
  if (self) { return } // Ignore messages from the bot
  // This isn't a command since it has no prefix:

  if(context.username == 'thabottress' && msg == `I'm up and running.`)
    backupBot.bottressStatusLive();

  // hangman logic
  if(!hangman.getPause() && target == '#' + hangman.channel){
    if (hangman.isAnswer(msg)) {
      hangman.winner = context['display-name']
      recordPayouts(`The winner is ${hangman.winner}! ${hangman.answer}`)
      client.say(target, `The winner is ${hangman.winner}! ${hangman.answer}`)
    }
    else if (msg.length == 1){
      let letter = msg.toUpperCase();
      let numCount = hangman.isNewLetter(letter)
      if(numCount > 0){
        client.say(target, `${letter} appears ${numCount} time${(numCount > 1)? 's': ''}!`)
        hangman.updateDisplay(letter)
        if(hangman.isDisplayAnswer()){
          hangman.winner = context['display-name']
          recordPayouts(`The winner is ${hangman.winner}! ${hangman.answer}`)
          client.say(target, `The winner is ${hangman.winner}! ${hangman.answer}`)
        }
        else client.say(target, `${hangman.display}`)
      }else if(numCount == 0)
        client.say(target, `no ${letter}`)
    }

    // display winner points if they are enrolled
    if (hangman.found && houses.isEnrolled(context.username)){
      client.say(target, `100 points to ${houses.houseNames[houses.students[context.username]]}!`)
      recordHousePoints(`100 points to ${houses.houseNames[houses.students[context.username]]}!`)
    }
  }

  // giveaway logic
  if(giveaway.allowEntries && target == "#" + giveaway.channel){
    console.log(`Checking name: ${context['display-name']}`)
    giveaway.isNewName(context['display-name'])
  }

  // randNum logic
  if(randNum.allowGuesses && target == "#" + randNum.channel){
    if(randNum.guess(msg)){
      recordPayouts(`${context['display-name']} wins! The correct number was ${randNum.number}`)
      client.say(target, `${context['display-name']} wins! The correct number was ${randNum.number}`)
      client.say(target, `${context['display-name']} wins! The correct number was ${randNum.number}`)
      client.say(target, `${context['display-name']} wins! The correct number was ${randNum.number}`)
      if(houses.isEnrolled(context.username)){
        client.say(target, `100 points to ${houses.houseNames[houses.students[context.username]]}!`)
        recordHousePoints(`100 points to ${houses.houseNames[houses.students[context.username]]}!`)
      }
    }
  }

  
  // wizard duel logic
  if(wizardDuel.allowEntries 
    && target == "#" + wizardDuel.channel
    && houses.isEnrolled(context.username)
    && !wizardDuel.checkIfInDuel(context['display-name'])){
      wizardDuel.enter(context['display-name'], houses.students[context.username])
      console.log(`${context['display-name']} entered the Dueling Club`)
  }

  // all commands go under here!
  if (msg.substr(0, 1) !== commandPrefix) {
    // this shows all of chat
    //console.log(`[${target} (${context['message-type']})] ${context['display-name']}: ${msg}`)
    return
  }
  // Split the message into individual words:
  const parse = msg.slice(1).split(' ')
  // The command name is the first (0th) one:
  const commandName = parse[0]
  
  // backup bot commands
  if(backupBot.isBottressDown() && target == '#thabuttress'){
    let message = backupBot.BotHandler(target, context.mod, commandName, parse)
    if(typeof message == "string")
      client.action(target, message)
    else if(typeof message == "object")
      message.then((res) => {
        client.action(target, res)
      })
    else{
      //console.log(`Message Returned as: ${message}`)
    }
  }
  
  // switch cases for wizardDuel only
  if(wizardDuel.beginDuel || wizardDuel.allowBets 
    || wizardDuel.allowEntries || wizardDuel.studentCount){
    switch(commandName){ // 
      case 'duel':
      // joining the duel will be here
      if(wizardDuel.allowEntries
        && target == "#" + wizardDuel.channel){
        if(!houses.isEnrolled(context.username))
          client.say(target, 
            `Sorry ${context['display-name']}, you don't have a !house yet.`)
        else{
          if(wizardDuel.checkIfInDuel(context['display-name']))
            client.say(target, `${context['display-name']} is in the Dueling Club!`)
          else{
            wizardDuel.enter(context['display-name'], houses.students[context.username])
            client.say(target, `Welcome to the dueling club ${context['display-name']}!`)
          }
        }
      }
      if(wizardDuel.winnerFound
        && target == "#" + wizardDuel.channel
        && wizardDuel.checkIfInDuel(context['display-name']))
        client.say(target, wizardDuel.myResults(context['display-name']))
        break;
      case 'pickDuelists':
        if(target == "#" + wizardDuel.channel
        && (context.username == "joefish5" || context.username == "thabuttress")){
          client.say(target, wizardDuel.pickDuelists())
        }
        break;
      case 'bet':
        if(target == "#" + wizardDuel.channel
          && wizardDuel.allowBets
          && houses.isEnrolled(context.username)){
          let arrMsg = msg.split(' ');
          if(arrMsg[1])
            wizardDuel.placeBet(context['display-name'], arrMsg[1])
          else
            client.say(target, 
              `Sorry ${context['display-name']}, need to do !bet 1 or !bet 2`)
        }
        else if(target == "#" + wizardDuel.channel
          && wizardDuel.winnerFound
          && wizardDuel.checkIfInDuel(context['display-name'])){
            client.say(target, wizardDuel.myResults(context['display-name']))
          }
        else if(target == "#" + wizardDuel.channel
          && !wizardDuel.allowBets){
            client.say(target, 
              `Sorry ${context['display-name']}. There's no one to !bet on yet.`)
          }
        break;
      case 'duelists':
        client.action(target, wizardDuel.options())
        break;
      case 'duelHouses':
        if(target == "#" + wizardDuel.channel)
          client.say(target, wizardDuel.showEntries())
        break;
      default:
        // commands during wizard duel that do not apply
        //console.log(`Wizard Duel Switch Case Default: ${commandName}`)
    }
  }
  // If the command is known, let's execute it:
  switch(commandName){
    case 'test':
      if(target == '#thabuttress'){
        backupBot.checkingBottressStatus();
      }
      break;
    case 'hangman':
      if(target == "#" + hangman.channel){
        (!hangman.getPause()) 
          ? client.say(target, `${hangman.display}`) 
          : client.say(target, "Hangman is currently paused!")
      }
      break;
    case 'guessed':
      if(!hangman.getPause() && target == "#" + hangman.channel)
        client.say(target, `Letters already guessed: ${hangman.alreadyGuessed()}`)
      break;
    case 'start':
      if(context['display-name'] == "JoeFish5" && target == "#" + giveaway.channel){
        giveaway.start(target.replace("#", ""))
        client.say(giveaway.channel, "GIVEAWAY HAS STARTED! Talk in chat to enter!")
      }
      break;
    case 'me':
      if(giveaway.allowEntries && target == "#" + giveaway.channel)
      client.say(giveaway.channel, 
        `${context['display-name']} is${(giveaway.check(context['display-name']) 
        ? " ": " not ")}in the giveaway. There's current ${giveaway.count} enteries.`)
      break;
    case 'quidditch':
      if(target == "#thabuttress" && context.username == "joefish5"){
        quidditch.start('thabuttress')
        client.say(target, "Want to play some Quidditch! Do !play to join the game!!!")
      }
      break;
    case 'play':
      if(quidditch.gameOn && target == "#" + quidditch.channel){
        let play = quidditch.play(context['display-name'])
        if(play == 10){
          client.say(quidditch.channel, `${context['display-name']} threw the Quaffle and scored! That's 10 points buttOMG 
            ${(quidditch.users[context['display-name']].tries < quidditch.maxTries)? quidditch.maxTries-quidditch.users[context['display-name']].tries : "No"} 
            ${(quidditch.users[context['display-name']].tries == quidditch.maxTries-1) ? "try" : "tries"} left.`)
        } else if(play == 0){
          client.say(quidditch.channel, `${context['display-name']} threw the Quaffle and missed! buttThump 
            ${(quidditch.users[context['display-name']].tries < quidditch.maxTries)? quidditch.maxTries-quidditch.users[context['display-name']].tries : "No"}
            ${(quidditch.users[context['display-name']].tries == quidditch.maxTries-1) ? "try" : "tries"} left.`)
        }else{
          console.log(`${context['display-name']} has hit the max tries of ${quidditch.users[context['display-name']].tries}`)
        }
      }
      else if(target == '#oooskittles' 
        && context.username == "oooskittles"
        && playMarbelsSkoots){
        playMarbelsSkoots = false;
        setTimeout(() => {
          client.say(target, `!play ${Math.floor(Math.random() * 15) + 1}`)
        }, 5000)
        setTimeout(() => {
          playMarbelsSkoots = true;
        }, 30000)
      }
      break;
    case 'results':
      if(!quidditch.gameOn && quidditch.playerCount && target == "#" + quidditch.channel){
        client.say(quidditch.channel, quidditch.finalPayouts())
      }
      break;
    case 'snitch':
      if(!quidditch.gameOn && quidditch.playerCount 
        && target == "#"+quidditch.channel){
        client.say(quidditch.channel, `${quidditch.snitch} caught the snitch!`)
      }
      break;
    case 'mypoints':
      if(target == "#" + quidditch.channel
        && quidditch.users[context['display-name']])
        client.say(target, quidditch.myPoints(context['display-name']))

      break;
    case 'whathouse':
      if(target == "#thabuttress" || target == "#joefish5"){
        let tryName = msg.split(' ')[1];
        (!tryName) ? client.say(target, houses.getHouse(context['display-name']))
          : client.say(target, houses.getHouse(tryName))
      }
      break;
    case 'houses':
      if(target == "#thabuttress" || target =="#joefish5"){
        client.say(target, houses.classSizes())
      }
      break;
    case 'myhouse':
      if(target == "#thabuttress" || target == "#joefish5"){
        let tryName = msg.split(' ')[1];
        (!tryName) ? client.say(target, houses.myHouse(context['display-name']))
          : client.say(target, houses.myHouse(tryName))
      }
      break;
    case 'cheer':
      if(houses.isEnrolled(context.username)){
        let houseNum = houses.students[context.username]
        if(houseNum == 0)
          client.action(target, `GO GO ${houses.houseNames[houseNum].toUpperCase()}`)
        else if(houseNum == 1)
          client.action(target, `HOT STUFF ${houses.houseNames[houseNum].toUpperCase()}`)
        else if(houseNum == 2)
          client.action(target, `WIN WIN ${houses.houseNames[houseNum].toUpperCase()}`)
        else // houseNum == 3
          client.action(target, `RA RA ${houses.houseNames[houseNum].toUpperCase()}`)
      }
      else{
        client.action(target, `Sorry ${context['display-name']}, you need a !house to cheer.`)
      }
      break;
    case 'raid':
      if(houses.isEnrolled(context.username)){
        let houseNum = houses.students[context.username]
        client.action(target, `buttButt buttCrew ${houses.houseNames[houseNum].toUpperCase()} RAID buttBest buttCrew`)
      }
      else{
        client.action(target, `MUGGLE RAID!!!`)
      }
      break;
    case 'commands':
      let commands = "Current list of all Harry Potter commands:";
      commands += " House info[!house !houses !whathouse !myhouse !earn !cheer !raid]";
      commands += " Quidditch[!play !results !mypoints !snitch]";
      commands += " Wizard duel[!wizard !duel !duelists !bet (1 or 2)]";
      commands += " Hangman[!hangman !guessed]";
      client.say(target, commands)
      break;
    default:
      // this shows unknows commands
      //console.log(`* Unknown command ${commandName}`)
  }
}

function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`)
}

// Called every time the bot disconnects from Twitch:
function onDisconnectedHandler (reason) {
  console.log(`Disconnected: ${reason}`)
  process.exit(1)
}

module.exports = client