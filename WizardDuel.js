const houses = require('./Houses')

/*
{
      Erecto: {
        define:"Erects things",
        0:"... Nothing happens...",
        1:"<other>'s clothes become extremely stiff, they're having trouble moving.",
        2:"<other>'s robes turn completely s rigid, they can barely move.",
        win:"<other> yields in shame."
      }
    },
*/
//gryf = 0, huff = 1, syl = 2, raven = 3
module.exports = {
  beginDuel: false,
  allowEntries: false,
  allowBets: false,
  winnerFound: false,
  betAmount: 10,
  students: {},
  spells: [
    {
      Aguamenti:{
        define: "Shoots water from wand.",
        0:"Water starts coming out of <self>'s wand, but it doesn't even reach the other end of the stage.",
        1:"Water comes shooting out of <self>'s wand, <other> tries to dodge but can't in time! Now <other> is soaking wet!",
        2:"A torrent of water explodes out of <self>'s wand! <other> gets pushed to the ground from the sheer pressure!",
        win:"<other> slips on the water and drops their wand!"
      } 
    },
    {
      Confringo:{ 
        define:"Explode Flames on target",
        0:"<self> flicks their wand and a few embers come falling out...",
        1:"A fireball comes out of <self>'s wand! It's buttLit",
        2:"A blast of flames rages towards <other>!",
        win:"FIRE! <other>'s CLOAK IS ON FIRE!!!"
      }
    },
    {
      Conjunctivitis: {
        define:"Damages opponents eyesight",
        0:"<other>'s vision becomes a littler blurry.",
        1:"<other>'s vision becomes hazy. They can barely make out <self> from accross the stage.",
        2:"<other> can't see! They try to point their wand at <self> but they can't tell what they're aiming at.",
        win:"<self> yells \"EXPELLIARMUS!\"  and <other>'s wand flies out of their hand."
      }
    },
    {
      Deprimo: {
        define:"Wind Damaging Spell",
        0:"<self> produces a light breeze.",
        1:"<other>'s robes start rushing back, they have to lean forwards to keeps themselves from falling over.",
        2:"The wind is so strong that <other> is lifted off the ground and crashed into the wall at the other end of the stage.",
        win:"<other> looses grip of their wand."
      }
    },
    {
      Expelliarmus: {
        define:"Disarms your opponent",
        0:"<other>'s wand shakes a little.",
        1:"A ball of light comes out of <self>'s wand and hits <other>, they fall onto their back.",
        2:"A ball of light comes out of <self>'s wand and knocks <other> into the air. <other> lands on the ground face first with a violent thud.",
        win:"<other>'s wand goes flything accress the room!"
      }
    },
    {
      Immobulus: {
        define:"Renders target immobile.",
        0:"<other>'s shoulders become stuff.",
        1:"<other> muscles tighten up, they can hardly move.",
        2:"<other> looks like Neville at the end of The Sorcerer's Stone!",
        win:"<other> can no longer continue."
      }
    },
    {Orchideous: { 
        define:"Conjures a bunch of flowers",
        0:"A few daisies sprout from <self>'s wand!",
        1:"A full bouquet comes out of <self>'s wand!",
        2:"Roses start bursting out of <self>'s wand! There are so many that they cover the stage, each student could take a dozen and their would still be more left over.",
        win:"<other> never received flowers before and is too happy to fight."
      }
    },
    {
      Rictusempra: {
        define:"Tickles opponent",
        0:"<other> isn't ticklish...",
        1:"<other> is ticklish and can't say a spell without laughing!",
        2:"<other> can't stop laughing! They're rolling on the ground and can barely speak.",
        win:"<other> yields. Tickle torture should also be an unforgivable curse."
      }
    },
    {
      Serpensortia: {
        define:"Produces Snake",
        0:"A small garden snake flies out of <self>'s wand!",
        1:"A King cobra springs out of <self>'s wand! <other> leads back in suprise.",
        2:"A giant anaconda comes bursting out of <self>'s wand! It lands on the stage and shakes the entire room! The snake starts slithering towards <other>.",
        win:"Who are you <self>? The next dark lord?!?"
      }
    },
    {
      Stupefy: {
        define:"Knocks out opponent",
        0:"<other> feels like they just got slapped in the face.",
        1:"<other> gets pushed back, they stumble around trying to stay conscious.",
        2:"<other> is flung backwards! After twirling in the air a few times <other> lands back on the stage and rolls to the end. <other> is able to get on their knees but everything starts going dark.",
        win: "<other> passes out."
      }
    },
    {
      Tarantallegra: {
        define:"Forces opponent to dance",
        0:"<other> starts taping their foot.",
        1:"<other> can't help but dance, good thing they were taking notes during Professor Mcgonagall dancing instructions.",
        2:"<other> starts moshing on the stage... Every is staring buttWut",
        win: "<other> can dance if they want to, and they did."
      }
    },
    {
      "Wingardium Leviosa": {
        define:"Makes on object fly",
        0:"<other> feels a little bit lighter, but their feet don't even leave the ground.",
        1:"<other>'s feet are barely touching the ground!",
        2:"<self> slowly motions their wand upward as <other> starts floating higher and higher above the stage. Regular James Potter this one is.",
        win:"Didn't you pay attention is class <other>? It's leviOsa, not levioSA!"
      }
    }
  ],
  duelists: [""],
  channel: "",
  studentCount: 0,
  studentHouseCount: [0, 0, 0, 0],
  finalPayouts:[0, 0, 0, 0],
  betsPlaced: [0, 0, 0],
  duelInfo: {},
  start: function(newChannel){
    if(this.winnerFound)
      this.clear();
    this.channel = newChannel;
    this.allowEntries = true;
  },
  enter: function(displayName, houseNumber){
    if(this.allowEntries && !this.students[displayName]){
      this.students[displayName] = {
        houseNum: houseNumber,
        betOn: 0,
        payout:0
      }
      ++this.studentCount
      ++this.studentHouseCount[houseNumber]
      //console.log(`${displayName} has entered the duel`)
    }
  },
  pickDuelists: function(){
    this.allowEntries = false;
    let picks = 0;
    let names = Object.keys(this.students)

    let student1 = Math.floor(Math.random() * this.studentCount)
    this.duelists[1] = names[student1]
    while(isButt(this.duelists[1]) || isJoe(this.duelists[1])){
      student1 = Math.floor(Math.random() * this.studentCount)
      this.duelists[1] = names[student1]
    }

    let student2 = Math.floor(Math.random() * this.studentCount)
    this.duelists[2] = names[student2]
    while(houses.students[this.duelists[1]] === houses.students[this.duelists[2]]
      && picks < 5 
      && (isButt(this.duelists[2]) || isJoe(this.duelists[2]))){
      console.log(`Duelists 1 house: ${houses.students[this.duelists[1]]} | Duelists 2 house: ${houses.students[this.duelists[2]]}`)
      student2 = Math.floor(Math.random() * this.studentCount)
      this.duelists[2] = names[student2]
      ++picks;
    }
    

    if(picks == 5){
      this.allowEntries = true;
      this.duelists[1] = this.duelists[2] = ""
      return "There weren't enough entries to start the duel. Reopening the club!"
    }

    this.allowBets = true;

    return `The Duelists have been chosen! 
      ${this.duelists[1]} from ${houses.houseNames[this.students[this.duelists[1]].houseNum]} 
      VS ${this.duelists[2]} from ${houses.houseNames[this.students[this.duelists[2]].houseNum]}!!! 
      DO !bet 1 [${this.duelists[1]}] or !bet 2 [${this.duelists[2]}]`
  },
  preSelectedStudents: function(info) {
    if(houses.students[info.student1] == houses.students[info.student2]){
      this.clear();
      return false;
    }
    this.start(info.channel)
    this.enter(info.student1, houses.students[info.student1])
    this.enter(info.student2, houses.students[info.student2])

    this.allowEntries = false;
    this.duelists[1] = info.student1;
    this.duelists[2] = info.student2;

    this.allowBets = true;

    return `The Duelists have been chosen! 
      ${this.duelists[1]} from ${houses.houseNames[this.students[this.duelists[1]].houseNum]} 
      VS ${this.duelists[2]} from ${houses.houseNames[this.students[this.duelists[2]].houseNum]}!!! 
      DO !bet 1 [${this.duelists[1]}] or !bet 2 [${this.duelists[2]}]`
  },
  options: function(){
    if(this.allowBets){
      return `!bet 1 [${this.duelists[1]} of 
      ${houses.houseNames[this.students[this.duelists[1]].houseNum]}] 
      or !bet 2 [${this.duelists[2]} of 
      ${houses.houseNames[this.students[this.duelists[2]].houseNum]}]`
    }
    else{
      return "This Duelists haven't been selected yet!"
    }
  },
  placeBet: function(name, bet){
    if(this.allowBets){
      if(!this.students[name]){
        this.allowEntries = true;
        this.enter(name, houses.students[name.toLowerCase()])
        this.allowEntries = false;
      }

      if(!this.students[name].bet){
        let reg1 = new RegExp(this.duelists[1], 'i');
        let reg2 = new RegExp(this.duelists[2], 'i');
        if(name != this.duelists[1] && name != this.duelists[2]){
          console.log(`${name} !bet ${bet} \t| ${houses.houseNames[this.students[name].houseNum]}`)
          if(bet == 1 || reg1.test(bet)){
            this.students[name].betOn = 1;
            ++this.betsPlaced[1];
          }
          else if(bet == 2 || reg2.test(bet)){
            this.students[name].betOn = 2;
            ++this.betsPlaced[2];
          }
        }
      }
    }
  },
  checkIfInDuel: function(name){
    if(this.students[name]) 
      return true 
    return false
  },
  readyToDuel: function(){
    this.beginDuel = true;
    console.log(`beginDuel readyToDuel(): ${this.beginDuel}`)
    this.allowBets = false;
    return `The bets are in and the duel is about to begin! 
    ${this.duelists[1]} has ${this.betsPlaced[1]} students on their side
    while ${this.duelists[2]} comes in with a crew of ${this.betsPlaced[2]}
    strong!`
  },
  showEntries: function(){
    let result = "Number of students by house in the Dueling Club:"
    for(let i = 0; i < 4; ++i)
      result += ` ${houses.houseNames[i]}: ${this.studentHouseCount[i]} |`
    
    return result
  },
  spellStrengthOption: function(num){
    if(num > 75) return 2;
    else return 1;
  },
  duelArray: function(){
    if(this.winnerFound){
      let actions = [];

      let spellName1 = Object.keys(this.spells[this.duelInfo.duel1.spellChoice])[0];
      let duel1SpellStrength = this.duelInfo.duel1.strength;
      duel1SpellStrength = this.spellStrengthOption(duel1SpellStrength)
      let duel1Attack = this.spells[this.duelInfo.duel1.spellChoice][spellName1][duel1SpellStrength]


      let spellName2 = Object.keys(this.spells[this.duelInfo.duel2.spellChoice])[0];
      let duel2SpellStrength = this.duelInfo.duel2.strength;
      duel2SpellStrength = this.spellStrengthOption(duel2SpellStrength)
      let duel2Attack = this.spells[this.duelInfo.duel2.spellChoice][spellName2][duel2SpellStrength]
      
      // do win spell for winning ability
      if(this.duelists[0] != ""){
        if (this.duelists[0] == this.duelInfo.duel1.name){
          actions.push(`${this.duelInfo.duel1.name} casts ${spellName1}!`)
          actions.push(replaceNamesAction(duel1Attack, this.duelInfo.duel1.name, this.duelInfo.duel2.name))
          actions.push(replaceNamesAction(this.spells[this.duelInfo.duel1.spellChoice][spellName1].win, this.duelInfo.duel1.name, this.duelInfo.duel2.name))
        }
        else{
          actions.push(`${this.duelInfo.duel2.name} casts ${spellName2}!`)
          actions.push(replaceNamesAction(duel2Attack, this.duelInfo.duel2.name, this.duelInfo.duel1.name))
          actions.push(replaceNamesAction(this.spells[this.duelInfo.duel2.spellChoice][spellName2].win, this.duelInfo.duel2.name, this.duelInfo.duel1.name))
        }
      }
      // push the fun stuff later
      return actions
    }
  },
  timeToDuel: function()  {
    console.log(`beginDuel timeToDuel(): ${this.beginDuel}`)
      if(this.beginDuel){ //this.beginDuel is not working?
      this.duelInfo = {
        duel1:{
          name:this.duelists[1],
          strength:Math.floor(Math.random()*100)+1,
          spellChoice: this.pickRandomSpell()
        },
        duel2:{
          name:this.duelists[2],
          strength:Math.floor(Math.random()*100)+1,
          spellChoice: this.pickRandomSpell()
        }
      }
      if(this.duelInfo.duel1.strength > this.duelInfo.duel2.strength){
        this.betsPlaced[0] = 1;
        this.duelists[0] = this.duelInfo.duel1.name;
      }else if(this.duelInfo.duel1.strength < this.duelInfo.duel2.strength){
        this.betsPlaced[0] = 2;
        this.duelists[0] = this.duelInfo.duel2.name;
      }
      
      this.beginDuel = false;
      this.winnerFound = true;
    } //end if
  },
  pickRandomSpell: function(){
    return Math.floor(Math.random() * this.spells.length)
  },
  finalHousePayouts: function(){
    let names = Object.keys(this.students);
    let totalBets = (this.betsPlaced[1] + this.betsPlaced[2]) * this.betAmount;
    let champsTake = Math.ceil(totalBets/2);
    let winningBetsTotal = totalBets - champsTake;
    let winnerPortion = Math.floor(winningBetsTotal / this.betsPlaced[[this.betsPlaced[0]]])
    console.log(`Winning bet payout: ${winnerPortion}`)
    if(this.betsPlaced[0]){ // winner found
      for(let i = 0; i < this.studentCount; ++i){
        if(names[i] == this.duelists[0]){
          this.students[this.duelists[0]].payout = champsTake;
        }else if(this.students[names[i]].betOn == this.betsPlaced[0]){
          this.students[names[i]].payout = winnerPortion;
        }else if(this.students[names[i]].betOn != 0){
          this.students[names[i]].payout = -1 * this.betAmount;
        }else{
          //console.log(`${names[i]} didn't bet`)
        }
  
        this.finalPayouts[this.students[names[i]].houseNum] 
          += this.students[names[i]].payout
      }
    }
    else { //it was a tie
      this.students[this.duelists[1]].payout = this.students[this.duelists[2]].payout = Math.floor(champsTake/2);
      for(let i = 0; i < this.studentCount; ++i){
        if(names[i] != this.duelists[1] || names[i] != this.duelists[2]){ // not a duelist
          if(this.students[names[i]].betOn)
            this.students[names[i]].payout = -1 * this.betAmount;
        }
      }
    }
  },
  houseResults: function(){
    let result = "House payouts for the duel:"
    
    for(let i=0; i < 4; ++i)
      result += ` ${houses.houseNames[i]}: ${this.finalPayouts[i]} |`

    return result
  },
  myResults: function(name){
    let result;
    
    if(name == this.duelists[0]){
      result = `${name} won the duel against ${(name == this.duelists[1]) 
        ? ` ${this.duelists[2]}` : ` ${this.duelists[1]}`}! ${this.students[name].payout} POINTS TO ${houses.houseNames[this.students[name].houseNum].toUpperCase()}!!!` 
    }else if(this.students[name].payout > 0){
      result = `${name} added ${this.students[name].payout} points to ${houses.houseNames[this.students[name].houseNum]}`
    }else{
      result = `${name} lost ${this.students[name].payout*-1} of ${houses.houseNames[this.students[name].houseNum]}'s points buttThump`
    }

    return result;
  },
  champ: function(){
    if (this.duelists[0] != "") 
      return `${this.duelists[0]} won the duel! ${this.students[this.duelists[0]].payout} POINTS TO ${houses.houseNames[this.students[this.duelists[0]].houseNum].toUpperCase()}!!!`;
    return `${this.duelists[1]} and ${this.duelists[2]} were equaly matched. They had a good duel though so they split the winnings!`
  },
  clear: function(){
    this.beginDuel = false;
    this.allowEntries = false;
    this.allowBets = false;
    this.winnerFound = false;
    this.students = {};
    this.duelists = [""];
    this.channel = "";
    this.studentCount = 0;
    this.studentHouseCount = [0,0,0,0]
    this.finalPayouts = [0,0,0,0]
    this.betsPlaced = [0,0,0]
  }
}

// helper functions
function replaceNamesAction(action, self, other){
  return action.replace(/<self>/g, self).replace(/<other>/g, other)
}

function isButt(name){
  return name.toLowerCase() == "thabuttress"
}

function isJoe(name){
  return name.toLowerCase() == "joefish5"
}