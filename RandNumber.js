module.exports = {
  number: 0,
  upper: 0,
  allowGuesses: false,
  channel: "",
  start: function(upper, channel){
    this.number = Math.floor(Math.random() * upper) + 1;
    this.channel = channel
    this.allowGuesses = true
  },
  guess: function(num){
    if(num == this.number){
      this.allowGuesses = false;
      return true
    }
    return false
  },
  clear: function(){
    this.number = 0;
    this.upper = 0;
    this.channel = ""
    this.allowGuesses = false;
  }
}