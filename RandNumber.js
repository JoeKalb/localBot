module.exports = {
  number: 0,
  upper: 0,
  allowGuesses: false,
  channel: "",
  start (upper, channel){
    this.number = Math.floor(Math.random() * upper) + 1;
    this.channel = channel
    this.allowGuesses = true
  },
  guess(num){
    if(num == this.number){
      this.allowGuesses = false;
      return true
    }
    return false
  },
  clear(){
    this.number = 0;
    this.upper = 0;
    this.channel = ""
    this.allowGuesses = false;
  }
}

/* class RandNum {
  contructor(upper, channel){
    this.upper = upper
    this.channel = channel
    this.number = Math.floor(Math.random() * upper) + 1
    this.allowGuesses = true;
  }

  get upper() {
    return this.upper
  }

  get allowGuesses() {
    return this.allowGuesses
  }

  get number() {
    return this.number
  }

  guess(num){
    if(num == this.number){
      this.allowGuesses = false;
      return true;
    }
    return false;
  }

  clear() {
    this.upper = 0;
    this.channel = ""
    this.number = 0
    this.allowGuesses = false
  }
} */