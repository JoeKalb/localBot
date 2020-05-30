const response = {
    hasMessage:false,
    hasDelay:false,
    hasPayout:false,
    hasMultiPayout:false,
    isAction:false,
    hasPromise:false,
    timedMessage:0,
    items:[]
}

const commandPrefix = '!';

module.exports = {
    channel:'#taylien',
    handleMessage: (context, msg) => {
        if(context.username === 'joefish5'){
            if(msg.substr(0,1) !== commandPrefix)
                return {hasMessage:false}; // not a command

            const parse = msg.slice(1).split(' ')
            const commandName = parse[0]

            switch(commandName){
                case 'timer':{

                }
                default:
                    return {
                        hasMessage:false
                    }
            }
        }
    },
    hostingHandler: (channel, target, viewers) => {
        let result = Object.assign({}, response)

        result.hasMessage = false
        result.items = [
            `sbtHype Hey Taylien, ${channel} just hosted you with ${viewers} viewers!`
        ]

        //console.log(`channel ${channel}`)
        //console.log(`target: ${target}`)
        return result
    },
    raidedHandler: (channel, username, viewers) => {
        let result = Object.assign({}, response)

        result.hasMessage = false
        result.items = [
            `sbtHype Hey Taylien, ${username} just raided you with ${viewers} viewers!`
        ]

        return result
    },
    cheerHandler: (userstate, message) => {
        let result = Object.assign({}, response)

        result.hasMessage = true
        result.items = [
            `sbtO Hey Taylien! ${userstate['display-name']} just cheered with ${userstate.bits} bits! sbtHype`
        ]

        return result
    },
    subHandler: (username, method, messsage, userstate) => {
        let result = Object.assign({}, response)

        result.hasMessage = true
        result.items = [
            (userstate['msg-param-sub-plan'] === 'Prime')
            ? `Hey Taylien! ${username} just Prime subbed! sbtHype sbtHype sbtHype`
            :`Hey Taylien! ${username} just T${parseInt(method.plan) / 1000} subbed! sbtHype sbtHype sbtHype`
        ]

        return result
    },
    resubHandler: (username, methods, message, userstate) => {
        let result = Object.assign({}, response)

        result.hasMessage = true
        result.items = [
            (userstate['msg-param-sub-plan'] === 'Prime')
            ? `Hey Taylien! ${username} just Prime subbed for ${userstate['msg-param-cumulative-months']} months! sbtHype sbtHype sbtHype`
            :`Hey Taylien! ${username} just T${parseInt(methods.plan) / 1000} subbed for ${userstate['msg-param-cumulative-months']} months! sbtHype sbtHype sbtHype `
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
                `Hey Taylien! ${username} just gifted ${recipient} a T${parseInt(methods.plan) / 1000} sub! sbtHype sbtHype sbtHype`
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
            `Hey Taylien! ${username} just gifted ${numbOfSubs} T${parseInt(methods.plan) / 1000} subs! sbtHype sbtHype sbtHype`
        ]

        return result
    }
}


let mysterySubGifter = {}