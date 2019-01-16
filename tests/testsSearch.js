const houses = require('../Houses')
let search = require('../Search')

let names = Object.keys(houses.students)

search.start("thabuttress")

for(let i in names)
  search.addStudent(names[i])

search.chooseStudent()
search.setItem()

console.log(search.startGameDisplay())

let sneak = search.getSneakyName()

for(let i in names){
  search.vote(names[i], Math.floor(Math.random() *2) + 1)
}

console.log(search.showVotes()) // no space between voting

console.log(search.displayTurn())

while(search.getContinueGame()){
  for(let i in names){
    search.vote(names[i], Math.floor(Math.random() * 2) + 1)
  }
  console.log(search.showVotes())
  console.log(search.displayTurn())
}

search.calcFinalPayouts()