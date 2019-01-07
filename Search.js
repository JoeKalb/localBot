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
let items = [`Sorcerer's Stone`, `Chamber of Secrets`, `Infinate keg of Butterbeer`, 
  `Goblet of Fire`, `Room of Requirement`, `OWLs answer key`]
let chosenDirection = [0, 0, 0]
let isChosenRight = [false, false, false]
let options = [
  {
    win:"First win",
    lose: "First lose [Filtch]"
  },
  {
    win:"Second win",
    lose: "Second lose [McGonagall]"
  },
  {
    win:"Third win",
    lose:"Third lose [snape]"
  }
]

let allowVotes = false;
let allowVotesTimer;
let housePayouts = [0, 0, 0, 0]

module.exports = {
  channel:"",
  start: (channel) => {
    this.channel = channel
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
    options[2].win = `${sneakyStudent.name} found the ${items[sneakyStudent.item]}!`
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
      if(turn == 3)
        foundItem = true;
      return options[turn-1].win
    }
    else{
      continueGame = false;
      return options[turn].lose
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
            }else if(sneakyStudent.vote[checkTurn] != 0) // made wrong choice
              housePayouts[sneakyStudent.houseNum] -= 5 * (checkTurn + 1)
          }else{ // regular student vote

          }
        }
        else{

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