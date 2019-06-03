// features to add !guessesAlready !randomWord

module.exports = {
  pause: true,
  found: false,
  answer:"",
  display:"",
  winner:"",
  channel: "",
  prevGuesser:"",
  wordCount: 0,
  lettersCount:{},
  guessed: new Set(),
  start: function(newInfo){
    if(this.wordCount)
      this.clear();
    this.answer = newInfo.hangman
    this.channel = newInfo.channel
    this.display = newInfo.hangman.replace(/[A-Z]/g, '-')
    this.wordCount = newInfo.hangman.split(" ").length;
    newInfo.hangman.split("").forEach((el) => {
      if(/^[a-zA-Z]+$/.test(el))
        (this.lettersCount[el]) ?
          this.lettersCount[el] += 1 : this.lettersCount[el] = 1;
    })
    this.pause = false
    console.log(`Hangman Ready: ${this.answer}`)
  },
  getPause: function(){
    return this.pause
  },
  isNewLetter: function(newLetter, guesser){
    if(!this.guessed.has(newLetter) 
      && this.prevGuesser !== guesser
      && /[a-zA-Z]/.test(newLetter)){
      this.guessed.add(newLetter)
      this.prevGuesser = guesser
      if(this.lettersCount[newLetter])
        return this.lettersCount[newLetter]
      return 0
    }
    return -1 // letter already guessed or same guesser twice
  },
  isAnswer:function(guess){
    let reg = new RegExp(this.answer, 'i')
    if(reg.test(guess)){
      this.found = true;
      this.pause = true;
      return true;
    }
    return false;
  },
  updateDisplay: function(letter){
    let newDisplay = ""
    for(let i = 0; i < this.answer.length; ++i){
      if(this.answer[i] == letter)
        newDisplay += letter;
      else
        newDisplay += this.display[i];
    }

    this.display = newDisplay
  },
  isDisplayAnswer: function(){
    if(this.display == this.answer){
      this.found = true;
      this.pause = true;
      return true;
    }
    return false
  },
  alreadyGuessed: function(){
    let allLetters = ""

    this.guessed.forEach( (letter) => {
      allLetters += letter + " "
    })

    return allLetters
  },
  eachWordLength: function(answer){
    let result = new Array(this.wordCount)
    let words = answer.split(" ")
    for(let i = 0; i < this.wordCount; ++i)
      result[i] = words[i].length

    return result
  },
  clear: function(){
    this.pause = true
    this.found = false
    this.answer = ""
    this.display = ""
    this.winner = ""
    this.channel = ""
    this.wordCount = 0;
    this.lettersCount = {}
    this.guessed.clear()
  }
}