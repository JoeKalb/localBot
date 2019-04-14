const commandPrefix = '!';

const response = {
    hasMessage:false,
    hasDelay:false,
    hasPayout:false,
    hasMultiPayout:false,
    isAction:false,
    hasPromise:false,
    items:[]
}

module.exports = {
    channel:"#thethingssheplays",
    handelMessage:(context, msg) => {
        let result = Object.assign({}, response)
        result.items = []

        //console.log(context)
        //console.log(`Message: ${msg}`)
        return result;
    },
    cheerHandler:(userstate, msg) => {
        console.log(userstate)
        console.log(msg)
    }
}