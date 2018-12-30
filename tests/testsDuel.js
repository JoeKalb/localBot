const houses = require('../Houses')
let wizardDuel = require('../WizardDuel')

wizardDuel.start("thabuttress");
console.log(`Allow Entries: ${wizardDuel.allowEntries}`)

let testsStudents = [
  {displayName: 'JoeFish5'},
  {displayName: 'COOP3R'},
  {displayName: 'thaButtress'},
  {displayName: 'oi_ATOMSK_io'},
  {displayName: 'popthatbabymaker'},
  {displayName: 'MinovskyFlight'},
  {displayName: 'eZeGen'},
  {displayName: 'DrDrinks420'},
  {displayName: 'Periculum9'},
  {displayName: 'Phorr'},
  {displayName: 'WitchyChar'},
  {displayName: 'thaButtress'},
]

let allNames = Object.keys(houses.students)

for(let i in allNames){
  let newName = {displayName: allNames[i]}
  testsStudents.push(newName)
}
for(let i in testsStudents){
  wizardDuel.enter(testsStudents[i].displayName, 
    houses.students[testsStudents[i].displayName.toLowerCase()])
}
console.log(`There are ${wizardDuel.studentCount} in the duel club!`)
console.log(wizardDuel.pickDuelists())
console.log(wizardDuel.showEntries())

for(let i in testsStudents){
  wizardDuel.placeBet(testsStudents[i].displayName, 
    wizardDuel.duelists[1]) 
}

console.log(wizardDuel.readyToDuel())
console.log(wizardDuel.timeToDual())
console.log(wizardDuel.finalHousePayouts())

for(let i in testsStudents){
  console.log(wizardDuel.myResults(
    testsStudents[i].displayName))
}

console.log(wizardDuel.champ())