const houses = require('./Houses')

// private variables
const maxTurns = 3;
let turn = 0;
let allowEntries = false;
let searching = false;
let continueGame = true;
let foundItem = false;
let students = {} // find a student to sneak
let studentVote = {}
let sneakyStudent = {
  name:"",
  houseNum:-1,
  item:0,
  vote:[0, 0, 0]
}
let items = [`Sorcerer's Stone`, `Chamber of Secrets`, `Keg of Endless Butterbeer`, 
  `Goblet of Fire`, `Room of Requirement`, `OWLs answer key`]
let winItem = [
  `<name> comes face to face with a mirror, and then feel a small bump in their pocket.`, 
  `Behind the door is a dark staircase, <name> walks down it to find a giant stone face of Salazar Slytherin.`,
  `<name> walks into the giant room. If seems like its raining but liquid is sweet with its source bursting from the center of the room.`,
  `A giant stone chalice sits in the middle of the room with a huge blue flame coming out of it.`,
  `<name> really had to go to the bathroom, and finds the fanciests chamberpots in the entire school!`,
  `Floating in the middle of the room is a thin book that guarantees a perfect score on the tests next week!`]
let chosenDirection = [0, 0, 0]
let isChosenRight = [false, false, false]
let loseAmount = [10, 20 , 50]
let winAmount = 200
let otherStudentsBaseAmount = 10
let options = [
  {
    question:'Which way should <name> go when they leave the dorm? !left or !right',
    action: '<name> walks out of the dorm and turns <direction>.',
    win:"At the end of the hall there are two moving staircases.",
    lose: `<name> runs directly into Filtch's back, "Rather late hour to be out of the dorms isn't it." [${loseAmount[0]} points from <house>]`,
    staff: `Filtch`
  },
  {
    question:'Which staircase should <name> take? !left or !right',
    action:'<name> heads down the <direction> staircase.',
    win:`At the bottom of the staircase there are two doors.`,
    lose: `<name> sees a black cat sitting on the bottom of the staircase. The cat transforms into Professor McGonagall, "Howgarts students are not permitted to leave the dorms at night!" [${loseAmount[1]} points from <house>]`,
    staff: 'Professor Mcgonagall'
  },
  {
    question:'Which door should <name> open? !left or !right',
    action:'<name> slowly turns the knob of the door on the <direction>.',
    win:"Third win",
    lose:`<name> opens the door, and looks directly at Professor Snape, "Roaming the halls at this hour and someone will think you're up to something..." [${loseAmount[2]} points from <house>]`,
    staff: `Professor Snape`
  }
]

let allowVotes = false;
let allowVotesTimer;
let housePayouts = [0, 0, 0, 0]

module.exports = {
  channel:"",
  start: function(channel) {
    if(this.channel)
      this.clear();
    this.channel = channel;
    allowEntries = true;
  },
  allowEntries: function(){
    return allowEntries
  },
  searching: function(){
    return searching
  },
  addStudent: (name) => {
    if(allowEntries){
      students[name] = houses.students[name.toLowerCase()]
    }
  },
  chooseStudent: () => {
    allowEntries = false;
    searching = true;
    let names = Object.keys(students)

    let i = Math.floor(Math.random() * names.length)
    while(isButt(names[i]))
      i = Math.floor(Math.random() * names.length)

    sneakyStudent.name = names[i]
    sneakyStudent.houseNum = houses.students[names[i].toLowerCase()]
  },
  manualChooseStudent: (name) => {
    if(houses.isEnrolled(name)){
      let displayName = houses.getDisplayName(name)

      if(typeof displayName == 'object'){
        return displayName.then((res) => {
          sneakyStudent.name = res;
          sneakyStudent.houseNum = houses.students[name.toLowerCase()]
          allowEntries = false;
          searching = true;
          return true;
        })
      }
      else{
        sneakyStudent.name = displayName;
        sneakyStudent.houseNum = houses.students[name.toLowerCase()]
        allowEntries = false;
        searching = true;
        return true;
      }
    }
    console.log(`${name} doesn't have a house`)
    return false;
  },
  getSneakyName: () =>{
    return sneakyStudent.name
  },
  setItem: () => {
    sneakyStudent.item = Math.floor(Math.random() * items.length)
    options[2].win = `${formatAction(winItem[sneakyStudent.item])} ${sneakyStudent.name} found the ${items[sneakyStudent.item]}! [${winAmount} points to <house>]`
  },
  startGameDisplay: () => {
    allowVotes = true;
    /* allowVotesTimer = setTimeout( () => {
      allowVotes = false
    }, 60000) // 60 seconds for voting */
    return `${sneakyStudent.name} snuck out of the 
      ${houses.houseNames[sneakyStudent.houseNum]} dorm to search for the
      ${items[sneakyStudent.item]}. ${options[0].question.replace('<name>', sneakyStudent.name)}`
  },
  vote: (name, direction) => { // 1 = left, 2 = right // only when search is allowed
    if(searching && allowVotes){
      //console.log(`${name} voted ${direction}`)
      let reg = new RegExp(sneakyStudent.name, 'i')
      if(reg.test(name))
        sneakyStudent.vote[turn] = direction
      else{
        if(!studentVote.hasOwnProperty(name)){
          studentVote[name] = {
            houseNum: houses.students[name.toLowerCase()],
            vote: [0, 0, 0]
          }
        }
        studentVote[name].vote[turn] = direction
      }
    }
    else{
      console.log(`${name} tried to vote but voting is closed!`)
    }
  },
  showVotes: () => {
    if(allowVotes){
      clearInterval(allowVotesTimer)
      allowVotes = false;
    }
    let results = (sneakyStudent.vote[turn]) 
      ? `${sneakyStudent.name} wants to go ${showDirection(sneakyStudent.vote[turn])}.`
      : `${sneakyStudent.name} didn't choose a direction.`

    let left = 0;
    let right = 0;

    let names = Object.keys(studentVote)

    for(let i in names){
      if(studentVote[names[i]].vote[turn] == 1)
        ++left;
      else if(studentVote[names[i]].vote[turn] == 2)
        ++right;
    }

    let studentVotePower = 0
    if(left == right){
      results += ` ${left + right} students couldn't decide on a direction.`
    }
    else{
      studentVotePower = (left > right) ? Math.floor((left/(left + right) * 100))
        : Math.floor((right/(left + right) * 100))
      results += (left > right)
        ? ` (${studentVotePower}% of ${left+right} students chose left)`
        : ` (${studentVotePower}% of ${left+right} students chose right)`
    }

    if(!sneakyStudent.vote[turn]){
      if(left == right){
        chosenDirection[turn] = Math.floor(Math.random() * 2) + 1
        results += ` ${sneakyStudent.name} goes ${showDirection(chosenDirection[turn])}.`
      }
      else{
        chosenDirection[turn] = (left > right) ? 1:2
        results += ` ${sneakyStudent.name} goes ${showDirection((left > right)? 1:2)}.`
      }
    }else{
      chosenDirection[turn] = sneakyStudent.vote[turn]
      results += ` ${sneakyStudent.name} goes ${showDirection(sneakyStudent.vote[turn])}.`
    }

    return results;
  },
  getAllowVotes: () => {
    return allowVotes;
  },
  displayTurn: () => {
    let isCorrect = choseCorrectly()
    isChosenRight[turn] = isCorrect;
    let gameActions = [formatAction(options[turn].action)]
    if(isCorrect){
      ++turn;
      allowVotes = true;
      if(turn == 3){
        foundItem = true;
        continueGame = false;
      }
      gameActions.push(formatAction(options[turn-1].win))
      if(continueGame) 
        gameActions.push(formatAction(options[turn].question))
    }
    else{
      continueGame = false;
      gameActions.push(formatAction(options[turn].lose))
    }

    return gameActions
  },
  getCurrentQuestion: () => {
    if(continueGame){
      return formatAction(options[turn].question)
    }
    return false;
  },
  getContinueGame: () => {
    return continueGame;
  },
  getFoundItem: () => {
    return foundItem;
  },
  calcFinalPayouts: () => {

    let names = Object.keys(studentVote)

    let checkTurn = 0;

    let reg = new RegExp(sneakyStudent.name, 'i')
    while(chosenDirection[checkTurn] && checkTurn < 3){
      for(let name of names){
        if(!reg.test(name) && studentVote[name].vote[checkTurn]){
          if((isChosenRight[checkTurn] && studentVote[name].vote[checkTurn] == chosenDirection[checkTurn])
            || (!isChosenRight[checkTurn] && studentVote[name].vote[checkTurn] != chosenDirection[checkTurn]))
            housePayouts[studentVote[name].houseNum] += otherStudentsBaseAmount + (5 * checkTurn)
          else if((isChosenRight[checkTurn] && studentVote[name].vote[checkTurn] != chosenDirection[checkTurn])
            || (!isChosenRight[checkTurn] && studentVote[name].vote[checkTurn] == chosenDirection[checkTurn]))
            housePayouts[studentVote[name].houseNum] -= otherStudentsBaseAmount + (5 * checkTurn)
        }
      }
      ++checkTurn
    }

    // sneaky student payout
    if(foundItem)
      housePayouts[sneakyStudent.houseNum] += 200
    else
      housePayouts[sneakyStudent.houseNum] -= loseAmount[turn]
  },
  getHousePayouts: () => {
    let results = "Payouts for Search Items |"

    for(let i = 0; i < 4; ++i){
      results += ` ${houses.houseNames[i]}: ${housePayouts[i]} |`
    }

    return results
  },
  getMyResults: (name) => {
    let reg = new RegExp(sneakyStudent.name, 'i')
    if(reg.test(name)){
      if (foundItem) 
       return `${sneakyStudent.name} found ${items[sneakyStudent.item]}! [${winAmount} to ${houses.houseNames[sneakyStudent.houseNum]}] buttOMG`;
      return `${options[turn].staff} caught ${sneakyStudent.name} wandering the halls! [${loseAmount[turn]} from ${houses.houseNames[sneakyStudent.houseNum]}]`
    }
    
    if(continueGame || !studentVote.hasOwnProperty(name))
      return false;

    let result = `Search Payout for ${name}: [`

    let checkTurn = 0; 
    let totalPoints = 0;
    let amountChange = 0;
    while(chosenDirection[checkTurn] && checkTurn < 3){
      if((isChosenRight[checkTurn] && studentVote[name].vote[checkTurn] == chosenDirection[checkTurn])
        || !isChosenRight[checkTurn] && studentVote[name].vote[checkTurn] != chosenDirection[checkTurn]){
          amountChange = otherStudentsBaseAmount + (5 * checkTurn)
          totalPoints += amountChange;
          (checkTurn) ? result += `+${amountChange}`
            :result += `${amountChange}`
        }
      else if((isChosenRight[checkTurn] && studentVote[name].vote[checkTurn] != chosenDirection[checkTurn]
        || !isChosenRight[checkTurn] && studentVote[name].vote[checkTurn] == chosenDirection[checkTurn])){
          amountChange = otherStudentsBaseAmount + (5 * checkTurn)
          totalPoints -= amountChange;
          result += `-${amountChange}`
        }
      else{
        (checkTurn) ? result += '+0' : '0'; 
      }

      ++checkTurn;
    }

    let isGain = (totalPoints < 0) ? false : true;
    result += `] ${(isGain) ? `${totalPoints} points to` : `-${totalPoints * -1} points from`} ${houses.houseNames[studentVote[name].houseNum]} ${(isGain) 
      ? 'buttHouse' : 'buttThump'}`
  
    return result;
  },
  clear: function(){
    turn = 0;
    allowEntries = false;
    searching = false;
    continueGame = true;
    foundItem = false;
    students = {} // find a student to sneak
    studentVote = {}
    sneakyStudent = {
      name:"",
      houseNum:-1,
      item:0,
      vote:[0, 0, 0]
    }
    chosenDirection = [0, 0, 0]
    isChosenRight = [false, false, false]
    allowVotes = false;
    allowVotesTimer;
    housePayouts = [0, 0, 0, 0]
  }
}

// helper functions
let isButt = (name) => {
  return name.toLowerCase() == "thabuttress"
}

let isJoe = (name) => {
  return name.toLowerCase() == "joefish5"
}

let showDirection = (num) => {
  if(num == 1)
    return "left"
  else if(num == 2)
    return "right"
}

let choseCorrectly = () => {
  let wrongChoice = turn + 1;
  let choices = maxTurns + 3;
  let option = Math.floor(Math.random() * choices) + 1;
  console.log(`Current odds are ${choices - wrongChoice} out of ${choices}`)
  return option > wrongChoice;
}

let formatAction = (action) => {
  return action.replace('<name>', sneakyStudent.name).replace('<direction>', showDirection(chosenDirection[turn])).replace('<house>', houses.houseNames[sneakyStudent.houseNum])
}