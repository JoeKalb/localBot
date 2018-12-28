const tmi = require('tmi.js')
let hangman = require('./Hangman.js')
let giveaway = require('./Giveaway.js') 
let randNum = require('./RandNumber.js')
let CONFIG; 

if(process.env.OAUTH === undefined) {
  let localConfig = require('./config.js')
  CONFIG = localConfig.CONFIG;
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
      'oooskittles',
      'thabuttress',
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
          client.say(target, `The winner is ${hangman.winner}! ${hangman.answer}`)
        }
        else client.say(target, `${hangman.display}`)
      }else if(numCount == 0)
        client.say(target, `no ${letter}`)
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
      client.say(target, `${context['display-name']} wins! The correct number was ${randNum.number}`)
    }
  }

  // all commands go under here!
  if (msg.substr(0, 1) !== commandPrefix) {
    console.log(`[${target} (${context['message-type']})] ${context['display-name']}: ${msg}`)
    return
  }
  // Split the message into individual words:
  const parse = msg.slice(1).split(' ')
  // The command name is the first (0th) one:
  const commandName = parse[0]

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
      if(!hangman.getPause())
        client.say(target, `${hangman.display}`)
      else
        client.say(target, "Hangman is currently paused!")
      break;
    case 'guessed':
      if(!hangman.getPause())
        client.say(target, `Letters already guessed: ${hangman.alreadyGuessed()}`)
      break;
    case 'start':
      if(context['display-name'] == "JoeFish5"){
        giveaway.start(target.replace("#", ""))
        client.say(giveaway.channel, "GIVEAWAY HAS STARTED! Talk in chat to enter!")
      }
      break;
    case 'me':
      if(giveaway.allowEntries)
      client.say(giveaway.channel, 
        `${context['display-name']} is${(giveaway.check(context['display-name']) 
        ? " ": " not ")}in the giveaway. There's current ${giveaway.count} enteries.`)
    default:
      console.log(`* Unknown command ${commandName}`)
  }
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

app.get('/randNum/clear', (req, res) => {
  randNum.clear()
  res.status(200).json("Clear Random Number")
})

http.listen(webPort, () => {
  console.log('Mod Helper app listening on port ' + webPort);
});