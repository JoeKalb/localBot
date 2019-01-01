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

console.log(wizardDuel.readyToDuel()) //button click or !letsDuel
wizardDuel.timeToDual()
wizardDuel.finalHousePayouts()

/* show how you did
for(let i in testsStudents){
  console.log(wizardDuel.myResults(
    testsStudents[i].displayName))
}
*/

/*
console.log(wizardDuel.duelArray()) // array of actions
console.log(wizardDuel.champ()) // shows the winner
console.log(wizardDuel.houseResults()) // show payouts 
*/

function tryThis(){
  let actions = []
  actions = wizardDuel.duelArray();
  actions.push(wizardDuel.champ())
  actions.push(wizardDuel.houseResults())

  for(let i in actions)
    console.log(actions[i])

  /*
  for(let i in actions){
    setTimeout(function(){ 
      console.log("#"+wizardDuel.channel, actions[i])   
    }, 5000 + i*3000)
  }
  */
}

tryThis()