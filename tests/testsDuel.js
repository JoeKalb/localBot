const houses = require('../Houses')
let wizardDuel = require('../WizardDuel')

wizardDuel.start("thabuttress"); // start button
console.log(`Allow Entries: ${wizardDuel.allowEntries}`)

let testsStudents = []

let allNames = Object.keys(houses.students)

for(let i in allNames){
  let newName = {displayName: allNames[i]}
  testsStudents.push(newName)
}
for(let i in testsStudents){ //!duel
  wizardDuel.enter(testsStudents[i].displayName, 
    houses.students[testsStudents[i].displayName.toLowerCase()])
}
console.log(`There are ${wizardDuel.studentCount} in the duel club!`)
console.log(wizardDuel.pickDuelists()) //button click or !pickDuelists (butt and i)
console.log(wizardDuel.showEntries()) // show how many people per house

for(let i in testsStudents){
  wizardDuel.placeBet(testsStudents[i].displayName, 
    Math.floor(Math.random() * 2) + 1) // !bet 1 or !bet 2
}

console.log(wizardDuel.options())

console.log(wizardDuel.readyToDuel()) //button click or !letsDuel
console.log(wizardDuel.beginDuel)
wizardDuel.timeToDuel()
wizardDuel.finalHousePayouts()

let actions = []
function tryThis(){
  console.log(wizardDuel.duelArray())
  
  actions.push(wizardDuel.champ())
  actions.push(wizardDuel.houseResults())

  for(let i in actions)
    console.log(actions[i])
}

tryThis()

console.log(wizardDuel.myResults(wizardDuel.duelists[1])
  + ` - Power Level: ${wizardDuel.duelInfo.duel1.strength}`)
console.log(wizardDuel.myResults(wizardDuel.duelists[2])
  + ` - Power Level: ${wizardDuel.duelInfo.duel2.strength}`)