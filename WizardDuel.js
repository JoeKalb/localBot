const houses = require('./Houses')

//gryf = 0, huff = 1, syl = 2, raven = 3
module.exports = {
  beginDuel: false,
  allowEntries: false,
  allowBets: false,
  winnerFound: false,
  students: {},
  spells: [
    {Aguamenti: "Shoots water from wand."},
    {Confringo: "Explode Flames on target"},
    {Conjunctivitis: "Damages opponents eyesight"},
    {Deprimo: "Wind Damaging Spell"},
    {Erecto: "Erects things"},
    {Expelliarmus: "Disarms your opponent"},
    {"Finite Incantatum": "Stops any current spells"},
    {Immobulus: "Renders target immobile."},
    {Liberacorpus: "Counterspell"},
    {Orchideous: "Conjures a bunch of flowers"},
    {Protego: "Cause spells to reflect back to the sender"},
    {Rictusempra: "Tickles opponent"},
    {Serpensortia: "Produces Snake"},
    {Stupefy: "Knocks out opponent"},
    {Tarantallegra: "Forces opponent to dance"},
    {"Wingardium Leviosa": "Makes on object fly"}
  ],
  duelists: [""],
  channel: "",
  studentCount: 0,
  studentHouseCount: [0, 0, 0, 0],
  finalPayouts:[0, 0, 0, 0],
  betsPlaced: [0, 0, 0],
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
      console.log(`${displayName} has entered the duel`)
    }
  },
  pickDuelists: function(){
    this.allowEntries = false;
    let picks = 0;
    let names = Object.keys(this.students)

    let student1 = Math.floor(Math.random() * this.studentCount)
    this.duelists[1] = names[student1]

    let student2 = Math.floor(Math.random() * this.studentCount)
    while(this.students[names[student1]].houseNum == 
      this.students[names[student2]].houseNum
      && picks < 5){
      student2 = Math.floor(Math.random() * this.studentCount)
      ++picks;
    }
    this.duelists[2] = names[student2]

    if(picks == 5){
      this.allowEntries = true;
      this.duelists[1] = this.duelists[2] = ""
      return "There weren't enough entries to start the dual. Do !duel to join."
    }

    this.allowBets = true;

    return `The Dualists have been chosen! 
      ${this.duelists[1]} from ${houses.houseNames[this.students[this.duelists[1]].houseNum]} 
      VS ${this.duelists[2]} from ${houses.houseNames[this.students[this.duelists[2]].houseNum]}!!!`
  },
  placeBet: function(name, bet){
    if(!this.students[name].bet){
      let reg1 = new RegExp(this.duelists[1], 'i');
      let reg2 = new RegExp(this.duelists[2], 'i');
      if(name != this.duelists[1] && name != this.duelists[2]){
        console.log(name)
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
    return (this.betsPlaced[1] + this.betsPlaced[2]) == (this.studentCount-2)
  },
  checkIfInDuel: function(name){
    if (this.students[name])
      return true
    return false
  },
  readyToDuel: function(){
    this.beginDuel = true;
    this.allowBets = false;
    return `The bets are in and the dual is about to begin! 
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
  timeToDual: function(){
    if(this.beginDuel){
      let result = {
        dual1:{
          name:this.duelists[1],
          strength:Math.floor(Math.random()*100)+1,
          spellChoice: this.pickRandomSpell()
        },
        dual2:{
          name:this.duelists[2],
          strength:Math.floor(Math.random()*100)+1,
          spellChoice: this.pickRandomSpell()
        }
      }
      if(result.dual1.strength > result.dual2.strength){
        this.betsPlaced[0] = 1;
        this.duelists[0] = result.dual1.name;
      }else if(result.dual1.strength < result.dual2.strength){
        this.betsPlaced[0] = 2;
        this.duelists[0] = result.dual2.name;
      }
      
      this.beginDuel = false;
      this.winnerFound = true;

      return result;
    }
    return false;
  },
  pickRandomSpell: function(){
    return Math.floor(Math.random() * this.spells.length)
  },
  finalHousePayouts: function(){
    let names = Object.keys(this.students);
    let totalBets = this.studentCount * 10;
    let champsTake = Math.ceil(totalBets/2);
    let winningBetsTotal = totalBets - champsTake;
    let winnerPortion = Math.floor(winningBetsTotal / this.betsPlaced[[this.betsPlaced[0]]])
    
    if(this.betsPlaced[0]){
      for(let i = 0; i < this.studentCount; ++i){
        if(names[i] == this.duelists[0]){
          this.students[this.duelists[0]].payout = champsTake;
        }else if(this.students[names[i]].betOn == this.betsPlaced[0]){
          this.students[names[i]].payout = winnerPortion;
        }else
          this.students[names[i]].payout = -10;

        this.finalPayouts[this.students[names[i]].houseNum] 
          += this.students[names[i]].payout
      }
    }
    // tie game info
    

    
    let result = "The final payouts are:"
    
    for(let i=0; i < 4; ++i)
      result += ` ${houses.houseNames[i]}: ${this.finalPayouts[i]} |`

    return result
  },
  myResults: function(name){
    let result;
    
    if(name == this.duelists[0]){
      result = `${name} won the dual against ${(name == this.duelists[1]) 
        ? ` ${this.duelists[2]}` : ` ${this.duelists[1]}`}! ${this.students[name].payout} POINTS TO ${houses.houseNames[this.students[name].houseNum]}!!!` 
    }else if(this.students[name].payout > 0){
      result = `${name} contributed ${this.students[name].payout} points to ${houses.houseNames[this.students[name].houseNum]}`
    }else{
      result = `${name} lost ${this.students[name].payout} points from ${houses.houseNames[this.students[name].houseNum]}`
    }

    return result;
  },
  champ: function(){
    return `${this.duelists[0]} HAS EMERGED VICTORIOUS! ${this.students[this.duelists[0]].payout} TO ${houses.houseNames[this.students[this.duelists[0]].houseNum].toUpperCase()}!!!`
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