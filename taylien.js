const response = require('./models/response')
const commandPrefix = '!';

module.exports = {
    channel:'#taylien',
    handleMessage: (context, msg) => {
        let result = Object.assign({}, response)
        if(context.username === 'joefish5'){
            if(msg.substr(0,1) !== commandPrefix)
                return {hasMessage:false}; // not a command

            const parse = msg.slice(1).split(' ')
            const commandName = parse[0]

            
            switch(commandName){
                case 'swim':{
                    result.hasMessage = true
                    result.items = [
                        `Botfish is happily swimming along. ` 
                    ]
                    return result
                }
                default:
                    return result
            }
        }
        else
            return result
    },
    hostingHandler: (channel, target, viewers) => {
        let result = Object.assign({}, response)

        result.hasMessage = false
        result.items = [
            `Hey Taylien, ${channel} just hosted you with ${viewers} viewers!`
        ]

        //console.log(`channel ${channel}`)
        //console.log(`target: ${target}`)
        return result
    },
    raidedHandler: (channel, username, viewers) => {
        let result = Object.assign({}, response)

        result.hasMessage = false
        result.items = [
            `Hey Taylien, ${username} just raided you with ${viewers} viewers!`
        ]

        return result
    },
    cheerHandler: (userstate, message) => {
        let result = Object.assign({}, response)

        result.hasMessage = true
        result.items = [
            `Hey Taylien! ${userstate['display-name']} just cheered with ${userstate.bits} bits! "${message}"`
        ]

        return result
    },
    subHandler: (username, method, message, userstate) => {
        let result = Object.assign({}, response)
        result.hasMessage = true
        result.items = [
            (userstate['msg-param-sub-plan'] === 'Prime')
            ? `Hey Taylien! ${username} just Prime subbed!${(message === null) ? "" : ` "${message}"`}`
            :`Hey Taylien! ${username} just T${parseInt(method.plan) / 1000} subbed!${(message === null) ? "" : ` "${message}"`}`
        ]

        return result
    },
    resubHandler: (username, methods, message, userstate) => {
        let result = Object.assign({}, response)
        result.hasMessage = true
        result.items = [
            (userstate['msg-param-sub-plan'] === 'Prime')
            ? `Hey Taylien! ${username} just Prime subbed for ${userstate['msg-param-cumulative-months']} months!${(message === null) ? "" : ` "${message}"`}`
            :`Hey Taylien! ${username} just T${parseInt(methods.plan) / 1000} subbed for ${userstate['msg-param-cumulative-months']} months!${(message === null) ? "" : ` "${message}"`}`
        ]

        return result
    },
    subGiftHandler: (username, recipient, methods) => {
        let result = Object.assign({}, response)

        if(mysterySubGifter.hasOwnProperty(username)){
            (mysterySubGifter[username] < 1) ?
            delete mysterySubGifter[username] :
            --mysterySubGifter[username]
        }
        else{
            result.hasMessage = true
            result.items = [
                `Hey Taylien! ${username} just gifted ${recipient} a T${parseInt(methods.plan) / 1000} sub!`
            ]
        }

        return result
    },
    subMysteryGiftHandler: (username, numbOfSubs, methods, userstate) => {
        let result = Object.assign({}, response)
        if(mysterySubGifter.hasOwnProperty(username))
            mysterySubGifter[username] += numbOfSubs
        else mysterySubGifter[username] = numbOfSubs

        result.hasMessage = true
        result.items = [
            `Hey Taylien! ${username} just gifted ${numbOfSubs} T${parseInt(methods.plan) / 1000} subs!`
        ]

        return result
    }
}


let mysterySubGifter = {}