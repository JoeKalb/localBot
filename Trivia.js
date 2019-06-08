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
        let self = this;
        co(function*() {
            try{
                let res = yield fetch(`${questionURL}amount=${amount}&category=${category}`)
                let json = yield res.json();
                self.questions = yield json.results;
                self.play = true;
                self.questions.map((e) => decode(e))
                self.questions.forEach((e) => {
                    e.formated = getOptionsArr(e)
                })
                console.log(self.questions)
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
        let result = this.questions[this.currentQuest].question
        return result;
    }

    this.nextQuestion = () => {
        if(this.play){
            console.log(`Sending Question #: ${this.currentQuest}`)
            sendQuestion(this.channel, this.questions[this.currentQuest])
            ++this.currentQuest;
        }
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

function sendQuestion(channel, question) {
    const body = {
        question,
        channel,
    }
    console.log(body)
    co(function*() {
        try{
            let res = yield fetch('http://localhost:8001/trivia/question',{
                method:'post',
                body:JSON.stringify(body),
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                }
            })
            let json = yield res.json()
            console.log(json)
        }
        catch(err){
            console.log(err)
        }
    })
}

module.exports = Trivia;