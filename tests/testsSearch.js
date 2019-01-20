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

while(search.getContinueGame()){
  for(let i in names){
    if(sneak == names[i]) search.vote(sneak, 1)
    else search.vote(names[i], Math.floor(Math.random() * 2) + 1)
  }
  console.log(search.showVotes())
  console.log(search.displayTurn())
}

search.calcFinalPayouts()

console.log(search.getHousePayouts())