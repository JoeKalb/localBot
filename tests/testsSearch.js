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
  setTimeout(() => {
    search.vote(names[i], Math.floor(Math.random() *2) + 1)
  }, i * 1000)
}



setTimeout(() => {
  console.log(search.showVotes())
}, 60001) // 60 seconds for checking