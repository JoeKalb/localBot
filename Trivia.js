const co = require('co')
const fetch = require('node-fetch')
let houses = require('./Houses')

const tokenURL = 'https://opentdb.com/api_token.php?command=request'
const player = {

}

function Trivia(channel) {
    this.channel = channel;
    this.token = 'ba5508a8485de0d811eb94f6b08ec9e356cbf8bea777208cf7101d1ad6bf763e'
    this.players = {}
    this.questions = {}

    this.resetToken = () => {
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
}

module.exports = Trivia;