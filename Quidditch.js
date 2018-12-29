module.exports = {
  users: {},
  channel: "",
  gameOn: false,
  playerCount: 0,
  snitch: "",
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
    if(this.users[name].tries < 3){
      ++this.users[name].tries
      let shot = Math.floor(Math.random() * 10);
      if(shot > 4){
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
    this.users[this.snitch].points += 100;
    return result;
  },
  finalPayouts: function(){
    let result = "Final Results: ";
    let allPlayers = Object.keys(this.users);

    for(let i = 0; i < this.playerCount; ++i){
      result += `[ ${allPlayers[i]}: ${this.users[allPlayers[i]].points} ]`
    }

    return result;
  },
  clear: function(){
    this.users = {}
    this.gameOn = false;
    this.playerCount = 0;
    this.channel = ""
    this.snitch = ""
  }
}