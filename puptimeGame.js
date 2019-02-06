let players = {}
let currentNames = []
const puptime = 'puptime'

let gameOn = false;

module.exports = {
    channel:"",
    start:(channelName) => {
        if(Object.entries(players).length !== 0)
            this.clear().bind(this);
        this.channel = channelName;
        gameOn = true;
    },
    getGameOn: () => {
        return gameOn
    },
    checkMessage: (context, msg) => {
        if(gameOn){
            if(context.username === puptime){
                let regexMonty = new RegExp('buttMonty', 'g')
                let regexReggie = new RegExp('buttReggie', 'g')
    
                let hasMonty = regexMonty.test(msg)
                let hasReggie = regexReggie.test(msg)
    
                let amount = 0;
                if(hasMonty && hasReggie)
                    amount = 100;
                else if(hasMonty || hasReggie)
                    amount = 10;
    
                if(amount){
                    for(let name of currentNames){
                        if(players.hasOwnProperty(name))
                            players[name] += amount
                        else
                            players[name] = amount
                    }
                }
    
                currentNames = []
            }
            else{
                if(triggersPuptime(msg))
                    currentNames.push(context['display-name'])
            }
        }
    },
    end: () => {
        gameOn = false;
    },
    getPlayers: () => {
        return players
    },
    clear: () => {
        players = {}
        currentNames = []
        gameOn = false;
    }
}

// helper functions
function triggersPuptime(msg){
    let puptimeRegexs = [
        RegExp('pup', 'i'),
        RegExp('dog', 'i'),
        RegExp('puptime', 'i')
    ]

    for(let triggers of puptimeRegexs){
        if(triggers.test(msg))
            return true;
    }
    return false;
}