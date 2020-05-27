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

let mysterySubGifter = {}
module.exports = {
    channel:'#taylien',
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
        (mysterySubGifter.hasOwnProperty(username))?
            mysterySubGifter[username] += numbOfSubs:
            mysterySubGifter[username] = numbOfSubs

        result.hasMessage = true
        result.items = [
            `Hey Taylien! ${username} just gifted ${numbOfSubs} T${parseInt(methods.plan) / 1000} subs! sbtHype sbtHype sbtHype`
        ]

        return result
    }
}