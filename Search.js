const houses = require('./Houses')

// private variables
const maxTurns = 2;
let turn = 0;
let allowEntries = false;
let searching = false;
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
  },
  startGameDisplay: () => {
    return `${sneakyStudent.name} snuck out of the 
      ${houses.houseNames[sneakyStudent.houseNum]} dorm to search for the
      ${items[sneakyStudent.item]}.`
  },
  vote: (name, direction) => { // 1 = left, 2 = right // only when search is allowed
    if(searching){
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
  },
  showVotes: () => {
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
        ? ` ${studentVotePower}% of students wanted to go left.`
        : ` ${studentVotePower}% of students wanted to go right.`
    }

    if(studentVotePower > 75){
      chosenDirection[turn] = (left > right) ? 1:2
      results += ` ${sneakyStudent.name} goes ${showDirection((left > right)? 1:2)}`
    }else{
      chosenDirection[turn] = sneakyStudent.vote[turn]
      results += ` ${sneakyStudent.name} goes ${showDirection(sneakyStudent.vote[turn])}.`
    }

    return results;
  }
}

// helper functions
isButt = (name) => {
  return name.toLowerCase() == "thabuttress"
}

showDirection = (num) => {
  if(num == 1)
    return "left"
  else if(num == 2)
    return "right"
}