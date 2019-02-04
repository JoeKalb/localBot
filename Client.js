const tmi = require('tmi.js')
let hangman = require('./Hangman')
let giveaway = require('./Giveaway') 
let randNum = require('./RandNumber')
let quidditch = require('./Quidditch')
let wizardDuel = require('./WizardDuel')
let search = require('./Search')
const fs = require('fs');
const houses = require('./Houses')
let CONFIG;

let thabuttress = require('./thaButtress')
//let backupBot = require('./BackupBot')

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

function delayedWinnings(target, messages){
  for(let i in messages){
    setTimeout(() => {
      client.action(target, messages[i])   
    }, i*3000)
  }
}

function delayButtcoinPayout(target, user, amount){
  setTimeout(() => {
    client.say(target, `!buttcoins add ${user} ${amount}`)
  }, 3000)
}

function delaySayMessage(target, msg, seconds){
  setTimeout(() => {
    client.say(target, msg)
  }, seconds*1000)
}

// handle messages
function handleResponses(target, response){
  if(response.hasMessage){
    let len = response.items.length
    if(len == 1){
      if(typeof response.items[0] == 'object'){
        response.items[0].then((res) => {
          (response.isAction) ? client.action(target, res)
            : client.say(target, res)
        })
      }
      else{
        (response.isAction) ? client.action(target, response.items[0])
        : client.say(target, response.items[0])
      }
    } 
    else{
      let payout = ''
      if(response.hasPayout){
        payout = response.items[len - 1]
        response.items.pop();
        delaySayMessage(target, payout, len)
      }
      if(response.isAction){
        for(let item of response.items)
          client.action(target, item)
      }
      else{
        for(let item of response.items)
          client.say(target, item)
      }
    }
  }
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
    //'thethingssheplays',
   ]
}

let playMarbelsSkoots = true;

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

  // buttress items
  if(target == '#thabuttress'){
    handleResponses(target, thabuttress.handleMessage(context, msg))
  }
  /* if(context.username == 'thabottress' && msg == `I'm up and running.`)
    backupBot.bottressStatusLive();

  // hangman logic 
  if(!hangman.getPause() && target == '#' + hangman.channel){
    if (hangman.isAnswer(msg)) {
      hangman.winner = context['display-name']
      recordPayouts(`The winner is ${hangman.winner}! ${hangman.answer}`)
      client.say(target, `The winner is ${hangman.winner}! ${hangman.answer}`)
      delayButtcoinPayout(target, hangman.winner, 100);
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
          delayButtcoinPayout(target, hangman.winner, 100);
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
  } */

  // giveaway logic
/*   if(giveaway.allowEntries && target == "#" + giveaway.channel){
    console.log(`Checking name: ${context['display-name']}`)
    giveaway.isNewName(context['display-name'])
  } */

  // randNum logic
  if(randNum.allowGuesses && target == "#" + randNum.channel){
    if(randNum.guess(msg)){
      let randNumWinDisplay = `${context['display-name']} wins! The correct number was ${randNum.number}`
      recordPayouts(randNumWinDisplay)
      client.say(target, randNumWinDisplay)
      client.say(target, randNumWinDisplay)
      client.say(target, randNumWinDisplay)
      delayButtcoinPayout(target, context['display-name'], 100);
      /* if(houses.isEnrolled(context.username)){
        client.say(target, `100 points to ${houses.houseNames[houses.students[context.username]]}!`)
        recordHousePoints(`100 points to ${houses.houseNames[houses.students[context.username]]}!`)
      } */
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

  // save displayNames into houses from the chat
  if(target == '#thabuttress' || target == '#joefish5')
    houses.setDisplayName(context.username, context['display-name'])

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
  
  // switch cases for wizardDuel only
  if(commandName == 'startduel' && (target == '#thabuttress' || target == '#joefish5') 
    && (context.mod || context.username == 'thabuttress' || context.username == 'joefish5')
    && parse.length == 3){
    console.log(`Duel start in chat: ${parse}`)
    let info = {
      channel:'thabuttress',
      student1: parse[1].replace('@', '').toLowerCase(),
      student2: parse[2].replace('@', '').toLowerCase()
    }
    let duel = wizardDuel.preSelectedStudents(info)
    if(duel){
      Promise.all([duel]).then((duelRes) => {
        client.action(target, duelRes)
      })
    }
    else
      client.action(target, `This duel is forbidden!!!`)
  }
  else{
    //console.log(`!duel ${context['display-name']}`)
  }
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
      case 'begin':
        if(target == "#" + wizardDuel.channel
          && (context.mod || context.username == 'thabuttress' || context.username == 'joefish5') && wizardDuel.allowBets){
            client.action("#"+wizardDuel.channel, wizardDuel.readyToDuel());
            wizardDuel.timeToDuel();
            wizardDuel.finalHousePayouts();

            let actions = []
            let results = wizardDuel.houseResults();
            actions = wizardDuel.duelArray();
            actions.push(wizardDuel.champ());
            actions.push(results);

            delayedWinnings(wizardDuel.channel, actions)
          
            recordPayouts(results)
        }
        break;
      case 'testDuelBets':
        if(target == '#' + wizardDuel.channel
          && context.username == 'joefish5'){
            let names = Object.keys(houses.students)
            for(let name of names)
              wizardDuel.placeBet(name, Math.floor(Math.random() * 2) + 1)
          }
        break;
      default:
        // commands during wizard duel that do not apply
        //console.log(`Wizard Duel Switch Case Default: ${commandName}`)
    }
  }
  // search game commands
  if(commandName == 'starthunt'){
    if(parse.length > 1 && (context.mod || context.username == 'joefish5' || context.username == 'thabuttress')){
      search.start(target.replace('#', ''))
      let readyToSearch = search.manualChooseStudent(parse[1].replace('@', '').toLowerCase())

      if(readyToSearch){
        search.setItem()
        client.action(`#${search.channel}`, search.startGameDisplay())
      }
      else{
        search.clear()
        client.action(target, `Cannot find student: ${parse[1].replace('@', '')}`)
      }
    }
  }

  if(search.searching() && target == `#${search.channel}`){
    switch(commandName){
      case 'left':
        search.vote(context['display-name'], 1)
        break;
      case 'right':
        search.vote(context['display-name'], 2)
        break;
      case 'results':
        if(!search.getContinueGame()){
          client.action(target, search.getHousePayouts())
        }
        break;
      case 'mypoints':
        if(!search.getContinueGame())
          client.action(target, search.getMyResults(context['display-name']))
        break;
      case 'option':
        let options = search.getCurrentQuestion();
        if(options)
          client.action(target, options)
        break;
      case 'go':
        if(target == '#thabuttress' && (context.mod || context.username === 'thabuttress')){
          let votesDisplay = [search.showVotes()]
          for(let item of search.displayTurn()){
            votesDisplay.push(item)
          }

          if(!search.getContinueGame()){
            search.calcFinalPayouts()
            votesDisplay.push(search.getHousePayouts())

            recordPayouts(`${search.getHousePayouts()} | ${search.getMyResults(search.getSneakyName())}`)
          }
          delayedWinnings(search.channel, votesDisplay)
        }
        break;
      default:
    }
  }

  // If the command is known, let's execute it:
  // commands only for butt's channel
  if(target == '#thabuttress' || target == '#joefish5'){
    switch(commandName){
      case 'quidditch':
        if(target == "#thabuttress" && (context.mod || context.username == 'thabuttress')){
          quidditch.start('thabuttress')
          client.say(target, "Want to play some Quidditch! Do !play to join the game!!!")
        }
        break;
      case 'end':
        if(quidditch.playerCount && (context.mod || context.username == 'thabuttress') && quidditch.gameOn){
          let snitch = quidditch.snitchCaught();
          let winnings = quidditch.finalPayouts();
          let messages = [`${snitch} caught the Golden Snitch and ended the game!`, winnings]
          delayedWinnings(quidditch.channel, messages)
          recordPayouts(`${winnings} | ${snitch} caught the snitch!`)
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
          : client.say(target, houses.getHouse(tryName.replace('@', '')))
      }
      break;
    case 'houses':
      client.say(target, houses.classSizes())
      break;
    case 'students':
      client.say(target, houses.classSizes())
      break;
    case 'myhouse':
      let tryName = msg.split(' ')[1];
      (!tryName) ? client.say(target, houses.myHouse(context['display-name']))
        : client.say(target, houses.myHouse(tryName.replace('@', '')))
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
      else if (target == "#thabuttress"){
        client.action(target, `MUGGLE RAID!!!`)
      }
      break;
    case 'hunt':
      client.action(target, `During an item hunt you get the chance to choose !left or !right as you navigates Hogwarts while the other students in the chat also get to guess on which direction is correct. But be careful! If you run into a professor you'll loose house points but making it all the way through and win 200!!! buttHouse Main student losses: [10, 20, 50] | Other students win/loss: [10, 15, 20]`)
      break;
    case 'gry':
      client.say(target, houses.specificHouseStudents(0))
      break;
    case 'huff':
      client.say(target, houses.specificHouseStudents(1))
      break;
    case 'sly':
      client.say(target, houses.specificHouseStudents(2))
      break;
    case 'rav':
      client.say(target, houses.specificHouseStudents(3))
      break;
    case 'commands':
      let commands = "Current list of all Harry Potter commands:";
      commands += " House info [!house !houses !whathouse !myhouse !earn !cheer !raid !gry !huff !sly !rav] |";
      commands += " Quidditch [!play !results !mypoints !snitch] |";
      commands += " Wizard duel [!wizard !duel !duelists !bet (1 or 2)] |";
      commands += " Hangman [!hangman !guessed] |";
      commands += " Item Hunt [!left !right !option !mypoints !results !hunt]"
      client.say(target, commands)
      break;
    default:
        //console.log(`Unknown Command: ${commandName}`)
    }
  }

  switch(commandName){
    case 'start':
      if(context['display-name'] == "JoeFish5" && target == "#" + giveaway.channel){
        giveaway.start(target.replace("#", ""))
        client.say(giveaway.channel, "GIVEAWAY HAS STARTED! Talk in chat to enter!")
      }
      break;
    /* case 'me':
      if(giveaway.allowEntries && target == "#" + giveaway.channel)
      client.say(giveaway.channel, 
        `${context['display-name']} is${(giveaway.check(context['display-name']) 
        ? " ": " not ")}in the giveaway. There's current ${giveaway.count} enteries.`)
      break; */
    case 'play':
      if(target == '#oooskittles' 
        && context.username == "oooskittles"
        && playMarbelsSkoots){
        playMarbelsSkoots = false;
        setTimeout(() => {
          client.say(target, `!play ${Math.floor(Math.random() * 31) + 1}`)
        }, 5000)
        setTimeout(() => {
          playMarbelsSkoots = true;
        }, 30000)
      }
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