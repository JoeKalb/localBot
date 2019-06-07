const co = require('co')
const fetch = require('node-fetch')
const HTLMDecEnc = require('html-encoder-decoder')
let houses = require('./Houses')

const tokenURL = 'https://opentdb.com/api_token.php?command=request'
const questionURL = 'https://opentdb.com/api.php?'
const player = {
    name:"",
    answers:{},
    score:0
}

function Trivia(channel) {
    this.channel = channel;
    this.token = ''
    this.players = {}
    this.questions = []
    this.currentQuest = 0
    this.play = false

    this.clear = () => {
        this.players = {}
        this.questions = []
        this.currentQuest = 0
        this.play = false
    }

    this.setToken = () => {
        co(function*() {
            try{
                let res = yield fetch(tokenURL)
                let json = yield res.json()
                switch(json.response_code){
                    case 0:
                        this.token = json.token;
                        break;
                    default:
                        console.log(`Error Getting Token: ${json.response_code}\n${json.response_message}`)
                }
            }
            catch(err){
                console.log(err)
            }
        })
    }

    this.getQuestions = (amount, category) => {
        co(function*() {
            try{
                let res = yield fetch(`${questionURL}amount=${amount}&category=${category}`)
                let json = yield res.json();
                this.questions = yield json.results;
                this.play = true;
                this.questions.forEach((e) => decode(e))
                this.questions.forEach((e) => {
                    e.formated = getOptionsArr(e)
                })
            }
            catch(err){
                console.log(err)
            }
        })
    }

    this.answerSubmitted = (name, answer) => {
        if(this.play){
            if(this.players.hasOwnProperty(name)){
                this.players[name][this.currentQuest] = answer;
            }
            else{
                let newPlayer = Object.assign({}, player)
                newPlayer.name = name;
                newPlayer.answers[this.currentQuest] = answer;
                this.players[name] = newPlayer
            }
            console.log(this.players[name])
        }
    }

    this.getCurrentQuestion = () => {
        let result = this.questions[this.currentQuest].questions
        return result;
    }

}

function decode(info) {
    info.question = HTLMDecEnc.decode(info.question)
    info.correct_answer = HTLMDecEnc.decode(info.correct_answer)
    info.incorrect_answers.map((e) => HTLMDecEnc.decode(e))
}

function getOptionsArr(info) {
    if (info.type === 'boolean') {
        return [(info.correct_answer == 'True')? 1:2, 'True', 'False']
    }

    let result = [info.correct_answer, ...info.incorrect_answers].sort()
    result = [result.indexOf(info.correct_answer) + 1, ...result]
    return result;
    
}

module.exports = Trivia;