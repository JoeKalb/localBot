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
let chosenDirection = [0, 0, 0]
let isChosenRight = [false, false, false]
let loseAmount = [10, 20 , 50]
let winAmount = 200
let options = [
  {
    question:'Which way should <name> go when they leave the dorm? !left or !right',
    action: '<name> walks out of the dorm and turns <direction>.',
    win:"<name> leaves the <house> dorm and comes up on two moving staircases.",
    lose: `<name> runs directly into Filtch's back, "Rather late hour to be out of the dorms isn't it." [${loseAmount[0]} points from <house>]`
  },
  {
    question:'Which staircase should <name> take? !left or !right',
    action:'<name> heads down the <direction> staircase.',
    win:`After walking down the staircase on the, <name> walks straight down the hall and comes up on two doors.`,
    lose: `<name> sees a black cat sitting on the bottom of the staircase. The cat transforms into Professor McGonagall, "Howgarts students are not to leave their dorm at night!" [${loseAmount[1]} points from <house>]`
  },
  {
    question:'Which door should <name> open? !left or !right',
    action:'<name> slowly turns the knob of the door on the <direction>.',
    win:"Third win",
    lose:`<name> opens the door, and looks directly at Professor Snape, "Roaming the halls at this hour and someone will think you're up to something..." [${loseAmount[2]} points from <house>]`
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
  getSneakyName: () =>{
    return sneakyStudent.name
  },
  setItem: () => {
    sneakyStudent.item = Math.floor(Math.random() * items.length)
    options[2].win = `${sneakyStudent.name} found the ${items[sneakyStudent.item]}! [${winAmount} points to <house>]`
  },
  startGameDisplay: () => {
    allowVotes = true;
    allowVotesTimer = setTimeout( () => {
      allowVotes = false
    }, 30000) // 30 seconds for voting
    return `${sneakyStudent.name} snuck out of the 
      ${houses.houseNames[sneakyStudent.houseNum]} dorm to search for the
      ${items[sneakyStudent.item]}.`
  },
  vote: (name, direction) => { // 1 = left, 2 = right // only when search is allowed
    if(searching && allowVotes){
      //console.log(`${name} voted ${direction}`)
      if(name == sneakyStudent.name)
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
        ? ` (Student Vote: ${studentVotePower}% left)`
        : ` (Student Vote: ${studentVotePower}% right)`
    }

    if(studentVotePower > 75 || !sneakyStudent.vote[turn]){
      chosenDirection[turn] = (left > right) ? 1:2
      results += ` ${sneakyStudent.name} goes ${showDirection((left > right)? 1:2)}`
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
    if(isCorrect){
      ++turn;
      allowVotes = true;
      if(turn == 3){
        foundItem = true;
        continueGame = false;
      }
      return options[turn-1].win.replace('<name>', sneakyStudent.name).replace('<direction>', chosenDirection[turn]).replace('<house>', houses.houseNames[sneakyStudent.houseNum])
    }
    else{
      continueGame = false;
      return options[turn].lose.replace('<name>', sneakyStudent.name).replace('<direction>', chosenDirection[turn]).replace('<house>', houses.houseNames[sneakyStudent.houseNum])
    }
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
    if(foundItem)
      housePayouts[sneakyStudent.houseNum] += 200
    
    while(chosenDirection[checkTurn] && checkTurn < 3){
      for(let i in names){
        // check if the student chose the same way as the direct made
        let madeSameChoice;
        if(names[i] == sneakyStudent.name)
          madeSameChoice 
            = sneakyStudent.vote[checkTurn] == chosenDirection[checkTurn]
        else
          madeSameChoice 
            = studentVote[names[i]].vote[checkTurn] == chosenDirection[checkTurn]

        
        if(isChosenRight[checkTurn]){ // made it past round 
          if(names[i] == sneakyStudent.name){
            if(madeSameChoice){
              housePayouts[sneakyStudent.houseNum] += 10 * (checkTurn + 1)
            }
            else if(sneakyStudent.vote[checkTurn] != 0) // made wrong choice
              housePayouts[sneakyStudent.houseNum] -= 5 * (checkTurn + 1)
          }else{ // regular student vote
            if(madeSameChoice){
              housePayouts[studentVote[names[i]].houseNum] += 5 * (checkTurn + 1)
            }
            else if(studentVote[names[i]].vote[checkTurn] != 0){
              housePayouts[studentVote[names[i]].houseNum] -= 2 * (checkTurn + 1)
            }
          }
        }
        else{ // lost round
          if(names[i] == sneakyStudent.name){
            if(madeSameChoice){
              housePayouts[sneakyStudent.houseNum] -= loseAmount[checkTurn]
            }
            else if(sneakyStudent.vote[checkTurn] != 0) // made wrong choice
              housePayouts[sneakyStudent.houseNum] += 10 * (checkTurn + 1)
          }else{ // regular student vote
            if(madeSameChoice){
              housePayouts[studentVote[names[i]].houseNum] -= 2 * (checkTurn + 1)
            }
            else if(studentVote[names[i]].vote[checkTurn] != 0){
              housePayouts[studentVote[names[i]].houseNum] += 5 * (checkTurn + 1)
            }
          }
        }
      }

      ++checkTurn
    }
  },
  getHousePayouts: () => {
    let results = "Payouts for Search Items |"

    for(let i = 0; i < 4; ++i){
      results += ` ${houses.houseNames[i]}: ${housePayouts[i]} |`
    }

    return results
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
isButt = (name) => {
  return name.toLowerCase() == "thabuttress"
}

isJoe = (name) => {
  return name.toLowerCase() == "joefish5"
}

showDirection = (num) => {
  if(num == 1)
    return "left"
  else if(num == 2)
    return "right"
}

choseCorrectly = () => {
  let wrongChoice = turn + 1;
  let choices = maxTurns + 5;
  let option = Math.floor(Math.random() * choices) + 1;
  //console.log(`wrongChoice: ${wrongChoice}\nchoices: ${choices}\noption: ${option}`)
  return option > wrongChoice;
}