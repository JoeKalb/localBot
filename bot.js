const tmi = require('tmi.js')
let hangman = require('./Hangman')
let giveaway = require('./Giveaway') 
let randNum = require('./RandNumber')
let quidditch = require('./Quidditch')
let wizardDuel = require('./WizardDuel')
const fs = require('fs');
const houses = require('./Houses')
let CONFIG; 

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
    'joefish5',
    'thabuttress',
    'oooskittles',
    'thethingssheplays'
   ]
}

// Function called when the "dice" command is issued:
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1
}

// Create a client with our options:
let client = new tmi.client(opts)

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
      if(houses.isEnrolled(context.username)){
        client.say(target, `100 points to ${houses.houseNames[houses.students[context.username]]}!`)
        recordHousePoints(`100 points to ${houses.houseNames[houses.students[context.username]]}!`)
      }
    }
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
  

  // switch cases for wizardDual only
  if(wizardDuel.beginDuel || wizardDuel.allowBets 
    || wizardDuel.allowEntries || wizardDuel.studentCount){
    switch(commandName){
      case 'duel':
      // joining the dual will be here
      if(wizardDuel.allowEntries
        && target == "#" + wizardDuel.channel
        && houses.isEnrolled(context['display-name'])
        && !wizardDuel.checkIfInDuel(context['display-name'])){
        wizardDuel.enter(context['display-name'], houses.students[context.username]);
        client.say(target, `${context['display-name']} entered the Dueling Club!`)
      }
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
          && wizardDuel.checkIfInDuel(context['display-name'])){
          let arrMsg = mgs.split(' ');
          let readyToDuel = placeBet(context['display-name'], arrMsg[1])
          if(readyToDuel)
            client.say(target, wizardDuel.readyToDuel())
        }
        break;
      case 'duelHouses':
        if(target == "#" + wizardDuel.channel)
          client.say(target, wizardDuel.showEntries())
        break;
      case 'duelResults':
        if(target == "#" + wizardDuel.channel
          && (context.username == "thabuttress" || context.username == "joefish5")
          && !wizardDuel.allowEntries && !wizardDuel.allowBets){
            let result = wizardDuel.timeToDual()
            client.say(target, `${result.dual1.name} and ${result.dual2.name} 
            take center stage. They bow towards, sharply turn around, to opposite 
            ends of the platform.`);
          }
          dualStory(result)
        break;
      default:
        console.log(`Wizard Dual Switch Case Default: ${commandName}`)
    }
  }
  // If the command is known, let's execute it:
  switch(commandName){
    case 'dice':
      const num = rollDice()
      client.say(target, `You rolled a ${num}`)
      break;
    case 'nerds':
      client.say(target, "You're all such nerds!!!")
      console.log(`* Executed ${commandName} command`)
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
        client.say(target, houses.myHouse(context['display-name']))
      }
      break;
    default:
      // this shows unknows commands
      //console.log(`* Unknown command ${commandName}`)
  }
}

function dualStory(result){
  console.log("The actual dual will happen here!")
}

function test(target){
  console.log(`Testing in channel: ${target}`)
  client.say(target, "This is a test!")
}

// Called every time the bot connects to Twitch chat:
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`)
}

// Called every time the bot disconnects from Twitch:
function onDisconnectedHandler (reason) {
  console.log(`Disconnected: ${reason}`)
  process.exit(1)
}

const express = require('express')
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

var listener = app.listen(process.env.PORT, function() {
  console.log('Listening on port ', + listener.address().port)
  app.get('/', (req, res) => res.send('Hello World!'))
});

const http = require('http').Server(app);
const path = require('path');
const webPort = 8000;

app.use('/', express.static(path.join(__dirname + '/')));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/channels', (req, res) => {
  res.status(200).json(opts.channels)
})

app.get('/testBtn', (req, res) => {
  console.log("here for some reason")
  res.status(404).json("here for some reason")
})

app.get('/testBtn/:channel', (req, res) => {
  try{
    test(req.params.channel)
    res.status(200).json("Test Worked")
  }
  catch (err){
    console.log(err)
    res.status(404).send(err)
  }
})
// hangman
app.post('/hangman', (req, res) => {
  try{
    hangman.start(req.body)
    client.say(hangman.channel, `It's time for some hangman! ${hangman.wordCount} words (!hangman !guesses)`)
    client.say(hangman.channel, `${hangman.display}`)
    res.status(200).json(hangman.answer)
  }
  catch(err){
    res.status(404).send(err)
  }
})

app.get('/hangman/pause', (req, res) => {
  (hangman.getPause()) ? hangman.pause = false  
    : hangman.pause = true;
  
  res.status(200).json(hangman.getPause())
})

app.get('/hangman/clear', (req, res) => {
  hangman.clear();
  res.status(200).json("hangman reset")
})

//giveaway
app.get('/giveaway/:channel', (req, res) => {
  giveaway.start(req.params.channel)
  client.say(giveaway.channel, "GIVEAWAY HAS STARTED! Talk in chat to enter!")
  res.status(200).json("Giveaway Started")
})

app.get('/giveaway/game/stop', (req, res) => {
  giveaway.stopEntries()
  client.say(giveaway.channel, "Giveaway is now closed!")
  res.status(200).json("No More Entries")
})

app.get('/giveaway/game/draw', (req, res) => {
  let winner = giveaway.drawWinner()
  client.say(giveaway.channel, `Out of ${giveaway.count + 1} people the winner is ${winner}!`)
  res.status(200).json(`This winner is ${winner}`)
})

app.get('/giveaway/game/clear', (req, res) => {
  giveaway.clear()
  res.status(200).json("Giveaway now Cleared")
})

// rand number calls
app.get('/randNum/:info', (req, res) => {
  let info = req.params.info.split("+")
  randNum.start(info[0], info[1])
  client.say(info[1], `Guess a number betweet 1 and ${info[0]}`)
  res.status(200).json(`The correct number is ${randNum.number}`)
})

app.get('/randNum/game/clear', (req, res) => {
  randNum.clear()
  console.log("RANDOM NUMBER WAS CLEARED!!!")
  res.status(200).json("Clear Random Number")
})

// quidditch endpoints
app.get('/quidditch/:channel', (req, res) => {
  quidditch.start(req.params.channel)
  client.say(req.params.channel, "Want to play some Quidditch! Do !play to join the game!!!")
  res.status(200).json("Quidditch Game Started")
})

app.get('/quidditch/game/over', (req, res) => {
  if(quidditch.playerCount){
    let snitch = quidditch.snitchCaught();
    client.say(quidditch.channel, `${snitch} caught the Golden Snitch and ended the game!`);
    recordPayouts(quidditch.finalPayouts())
    client.say(quidditch.channel, quidditch.finalPayouts())
    res.status(200).json(`${snitch} caught the snitch!`)
  } 
  else res.status(200).json("No one played")
})

app.get('/quidditch/game/clear', (req, res) => {
  quidditch.clear();
  res.status(200).json("Quidditch Game Reset");
})

app.get('/quidditch/game/results', (req, res) => {
  if(!quidditch.gameOn && quidditch.playerCount){
    client.say(quidditch.channel, quidditch.finalPayouts())
  }
  res.status(200).json("Quidditch Results Posted")
})

app.get('/quidditch/game/payout', (req, res) => {
  if(quidditch.channel == 'thabuttress'){
    let allPlays = Object.keys(quidditch.users);
    for(let i = 0; i < quidditch.playerCount; ++i){
      if(quidditch.users[allPlays[i]].points)
        client.say(quidditch.channel, `!buttcoins add ${allPlays[i]} ${quidditch.users[allPlays[i]].points}`)
    }
  }
  res.status(200).json("Payouts done!")
})

// wizard duel calls
app.get('/duel/:channel', (req, res) => {
  wizardDuel.start(req.params.channel);
  client.say(req.params.channel, "Want to join the duel club? Type !duel and you might get a chance to prove yourself to your peers!")
  res.status(200).json("The Dueling Club is open!")
})

app.get('/duel/game/pick', (req, res) =>{
  if(wizardDuel.studentCount > 2){
    client("#" + wizardDuel.channel, wizardDuel.pickDuelists());
    res.status(200).json(`${wizardDuel.duelists[1]} VS ${wizardDuel.duelists[2]}`)
  }else
  res.status(200).json("Not enough students")
})

// clear all info
app.get('/clear/all', (req, res) => {
  giveaway.clear();
  hangman.clear();
  quidditch.clear();
  randNum.clear();
  res.status(200).json("All Games Cleared!")
})

http.listen(webPort, () => {
  console.log('Mod Helper app listening on port ' + webPort);
});