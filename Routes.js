const express = require('express')
let router = express.Router()

const co = require('co')
const fetch = require('node-fetch')

let hangman = require('./Hangman')
let giveaway = require('./Giveaway') 
let randNum = require('./RandNumber')
let quidditch = require('./Quidditch')
let wizardDuel = require('./WizardDuel')
let houses = require('./Houses')
let search = require('./Search')

let backupBot = require('./BackupBot')
let thabuttress = require('./thaButtress')

const fs = require('fs');
let today = new Date();
let fileName = `logs/${today.getUTCMonth()+1}-${today.getUTCDate()}.txt`;

function recordPayouts(message){
  fs.appendFile(fileName, `\n${message}`, (err) => {
    if(err) throw err;
    console.log(`Saved message: ${message}`)
  })
}

function test(target){
  console.log(`Testing in channel: ${target}`)
  client.say(target, "This is a test!")
}

let client = require('./Client')

router.get('/channels', (req, res) => {
  res.status(200).json(client.getChannels())
})

router.get('/testBtn', (req, res) => {
  console.log("here for some reason")
  res.status(404).json("here for some reason")
})

router.get('/testBtn/:channel', (req, res) => {
  try{
    test(req.params.channel)
    res.status(200).json("Test Worked")
  }
  catch (err){
    console.log(err)
    res.status(404).send(err)
  }
})

function delayedWinnings(target, messages){
  for(let i in messages){
    setTimeout(() => {
      client.action(target, messages[i])   
    }, i*3000)
  }
}

// hangman
router.post('/hangman', (req, res) => {
  try{
    if(req.body.channel == 'thabuttress'){
      thabuttress.startHangman(req.body)
      client.say('#thabuttress', `It's time for some hangman! ${thabuttress.getHangmanWordCount()} words (!hangman !guesses)`)
      client.say('#thabuttress', `${thabuttress.getHangmanDisplay()}`)
      res.status(200).json(thabuttress.getHangmanAnswer())
    }
    else{
      hangman.start(req.body)
      client.say(hangman.channel, `It's time for some hangman! ${hangman.wordCount} words (!hangman !guesses)`)
      client.say(hangman.channel, `${hangman.display}`)
      res.status(200).json(hangman.answer)
    }
  }
  catch(err){
    res.status(404).send(err)
  }
})

router.get('/hangman/pause', (req, res) => {
  if(thabuttress.getHangmanDisplay() != ""){
    thabuttress.toggleHangmanPause();
    res.status(200).json(thabuttress.getHangmanPause())
  }
  else{
    (hangman.getPause()) ? hangman.pause = false  
    : hangman.pause = true;
  
    res.status(200).json(hangman.getPause())
  }
  
})

router.get('/hangman/clear', (req, res) => {
  if(thabuttress.getHangmanDisplay() != ''){
    thabuttress.clearHangman();
  }
  else{
    hangman.clear();
  }
  res.status(200).json("hangman reset")
})

//giveaway
router.get('/giveaway/:channel', (req, res) => {
  giveaway.start(req.params.channel)
  client.say(giveaway.channel, "GIVEAWAY HAS STARTED! Talk in chat to enter!")
  res.status(200).json("Giveaway Started")
})

router.get('/giveaway/game/stop', (req, res) => {
  giveaway.stopEntries()
  client.say(giveaway.channel, "Giveaway is now closed!")
  res.status(200).json("No More Entries")
})

router.get('/giveaway/game/draw', (req, res) => {
  let winner = giveaway.drawWinner()
  client.say(giveaway.channel, `Out of ${giveaway.count + 1} people the winner is ${winner}!`)
  res.status(200).json(`This winner is ${winner}`)
})

router.get('/giveaway/game/clear', (req, res) => {
  giveaway.clear()
  res.status(200).json("Giveaway now Cleared")
})

// rand number calls
router.get('/randNum/:info', (req, res) => {
  let info = req.params.info.split("+")
  randNum.start(info[0], info[1])
  client.say(info[1], `Guess a number between 1 and ${info[0]}`)
  res.status(200).json(`The correct number is ${randNum.number}`)
})

router.get('/randNum/game/clear', (req, res) => {
  randNum.clear()
  console.log("RANDOM NUMBER WAS CLEARED!!!")
  res.status(200).json("Clear Random Number")
})

// quidditch endpoints
router.get('/quidditch/:channel', (req, res) => {
  quidditch.start(req.params.channel)
  client.say(req.params.channel, "Want to play some Quidditch! Do !play to join the game!!!")
  res.status(200).json("Quidditch Game Started")
})

router.get('/quidditch/game/over', (req, res) => {
  if(quidditch.playerCount){
    let snitch = quidditch.snitchCaught();
    let winnings = quidditch.finalPayouts();
    let messages = [`${snitch} caught the Golden Snitch and ended the game!${(houses.isEnrolled(snitch)) ? ` 100 points to ${houses.getHouseName(snitch.toLowerCase())}!`:``}`, winnings]
    delayedWinnings(quidditch.channel, messages)
    recordPayouts(`${winnings} | ${snitch} caught the snitch!`)
    res.status(200).json(`${snitch} caught the snitch!`)
  } 
  else res.status(200).json("No one played")
})

router.get('/quidditch/game/clear', (req, res) => {
  quidditch.clear();
  res.status(200).json("Quidditch Game Reset");
})

router.get('/quidditch/game/results', (req, res) => {
  if(!quidditch.gameOn && quidditch.playerCount){
    client.say(quidditch.channel, quidditch.finalPayouts())
  }
  res.status(200).json("Quidditch Results Posted")
})

router.get('/quidditch/game/payout', (req, res) => {
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
router.get('/duel/:channel', (req, res) => {
  wizardDuel.start(req.params.channel);
  client.say(req.params.channel, `Want to join the duel club? Just keep talking in chat and as long as you're in a 
    !house you might get a chance to prove yourself to your peers! [!wizard !duel]`)
  res.status(200).json("The Dueling Club is open!")
})

router.get('/duel/game/pick', (req, res) =>{
  if(wizardDuel.studentCount > 2){
    client.action("#" + wizardDuel.channel, wizardDuel.pickDuelists());
    res.status(200).json(`${wizardDuel.duelists[1]} VS ${wizardDuel.duelists[2]}`)
  }else
    res.status(200).json("Not enough students")
})

router.get('/duel/game/start', (req, res) => {
  if(wizardDuel.allowBets){
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
    res.status(200).json(wizardDuel.champ())
  }
  else res.status(200).json("Bets aren't in yet")
})

router.post('/duel/game/specialDuel', (req, res) => {
  
  let duel = wizardDuel.preSelectedStudents(req.body)
  // student house check
  /* if(houses.students[req.body.student1] != houses.students[req.body.student2]){
    

    if(typeof duel == 'object'){
      duel.then((duelRes) => {
        console.log('Special Duel Called: Promise Displays Names')
        client.action(`#${wizardDuel.channel}`, duelRes)
        res.status(200).json(`Wizard duel promise: ${req.body.student1} VS ${req.body.student2}`)
      })
    }
    else{
      console.log('Special Duel Called: stored Display Names')
      client.action("#" + wizardDuel.channel, duel)
      res.status(200).json(`Special Duel: ${req.body.student1} VS ${req.body.student2}`)
    }
  }
  else{
    res.status(200).json(`Duelists were from the same house, try again!`)
  } */
  if(typeof duel == 'object'){
    duel.then((duelRes) => {
      console.log('Special Duel Called: Promise Displays Names')
      client.action(`#${wizardDuel.channel}`, duelRes)
      res.status(200).json(`Wizard duel promise: ${req.body.student1} VS ${req.body.student2}`)
    })
  }
  else{
    console.log('Special Duel Called: stored Display Names')
    client.action("#" + wizardDuel.channel, duel)
    res.status(200).json(`Special Duel: ${req.body.student1} VS ${req.body.student2}`)
  }
})

router.get('/duel/game/clear', (req, res) => {
  wizardDuel.clear();
  res.status(200).json("clearing the duel")
})

// backup bot commands
router.get('/backupBot', (req, res) => {
  res.status(200).json(backupBot.isBottressDown())
})

router.get('/backupBot/toggle', (req, res) => {
  res.status(200).json(backupBot.toggleBackupBot())
})

// get all students for info
router.get('/students', (req, res) => {
  res.status(200).json(houses.students)
})

// search command routes
router.get('/search/:channel', (req, res) => {
  search.start(req.params.channel)
  res.status(200).json(`Search Started in Channel: ${search.channel}`)
})

router.post('/search', (req, res) => {
  search.start(req.body.channel)
  let searchGameStarted = search.manualChooseStudent(req.body.student)
  
  if (searchGameStarted){
    if(typeof searchGameStarted == 'object'){
      searchGameStarted.then((twitchRes) => {
        console.log(`object: ${searchGameStarted}`)
        search.setItem();
        client.action(`#${search.channel}`, search.startGameDisplay())

        if(twitchRes)
          res.status(200).json(`${search.getSneakyName()} is now searching!`)
        else
          res.status(404).json(`Something went wrong: ${twitchRes}`)
      })
    }
    else{
      console.log(`non object: ${searchGameStarted}`)
      search.setItem();
      client.action(`#${search.channel}`, search.startGameDisplay())

      res.status(200).json(`${search.getSneakyName()} is now searching!`)
    }
  }
  else res.status(404).json(`${req.body.student} not found.`)
})

router.get('/search/game/continue', (req, res) => {
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
  res.status(200).json(`Search Game Contunie`)
})

router.get('/search/game/clear', (req, res) => {
  search.clear();
  res.status(200).json(`Search Game Cleared`)
})

//send house info to House Points api
router.get('/house/update', (req, res) => {
  //let buttCoinAPI = 'http://localhost:8001/' //local
  let buttCoinAPI = 'https://butt-crew-house-points.herokuapp.com/' //live
 
  co(function *() {
    try{
      let houseUpdate = yield fetch(buttCoinAPI, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(houses.students)
      })
      let json = yield houseUpdate.json()
      res.status(200).json(json)
    }
    catch(err){
      console.log(err)
      res.status(404).json(err)
    }
  })
})

// clear all info
router.get('/clear/all', (req, res) => {
  giveaway.clear();
  hangman.clear();
  quidditch.clear();
  randNum.clear();
  wizardDuel.clear();
  search.clear();
  res.status(200).json("All Games Cleared!")
})

module.exports = router