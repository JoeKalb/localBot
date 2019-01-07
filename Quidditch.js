const houses = require('./Houses')

module.exports = {
  users: {},
  channel: "",
  gameOn: false,
  playerCount: 0,
  snitch: "",
  maxTries: 3,
  start: function(channelName){
    if(this.playerCount)
      this.clear;
    this.channel = channelName;
    this.gameOn = true;
  },
  play: function(name){
    if(!this.users[name]){
      this.users[name] = {
        tries: 0,
        points: 0
      };
      ++this.playerCount;
    }
    if(this.users[name].tries < this.maxTries){
      ++this.users[name].tries
      let shot = Math.floor(Math.random() * 2);
      if(shot){
        this.users[name].points += 10;
        return 10;
      }
      return 0;
    }
    return -1; // max number of tries
  }, 
  snitchCaught: function(){
    this.gameOn = false;
    let allPlayers = Object.keys(this.users);
    let result = this.snitch = allPlayers[Math.floor(Math.random() * this.playerCount)]
    while(result.toLowerCase() == "thabuttress")
      result = this.snitch = allPlayers[Math.floor(Math.random() * this.playerCount)]
    this.users[this.snitch].points += 100;
    return result;
  },
  finalPayouts: function(){
    let result = "Quidditch Results: ";
    let allPlayers = Object.keys(this.users);

    //gryf = 0, huff = 1, syl = 2, raven = 3
    let houseTotals = [0,0,0,0]

    for(let i = 0; i < this.playerCount; ++i){
      // swap results to only show house payouts
      //result += `[ ${allPlayers[i]}: ${this.users[allPlayers[i]].points} ]`;
      // add points to house value
      if(houses.isEnrolled(allPlayers[i]))
        houseTotals[houses.students[allPlayers[i].toLowerCase()]] += this.users[allPlayers[i]].points    
    }

    for(let i = 0; i < 4; ++i)
      result += ` ${houses.houseNames[i]}: ${houseTotals[i]} |`

    return result;
  },
  myPoints: function(name){
    return `${name} scored ${this.users[name].points} points${(houses.isEnrolled(name)) 
        ? ` for ${houses.houseNames[houses.students[name.toLowerCase()]]}!` 
        : `! Too bad they don't have a house yet buttThump`}`
  },
  clear: function(){
    this.users = {}
    this.gameOn = false;
    this.playerCount = 0;
    this.channel = ""
    this.snitch = ""
  }
}