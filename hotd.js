const response = {
    hasMessage:false,
    hasDelay:false,
    hasPayout:false,
    hasMultiPayout:false,
    isAction:false,
    hasPromise:false,
    items:[]
}

const commandPrefix = '!'

module.exports = {
    channel:'#hairofthedogpodcast',
    handleMessage:(context, msg) => {
        let result = Object.assign({}, response)
        result.items = []

        if(msg.substr(0,1) !== commandPrefix)
            return result;

        const parse = msg.slice(1).split(' ')
        const commandName = parse[0]

        switch(commandName){
            case 'ask':
                result.hasMessage = true;
                result.items = ['Ask questions here! http://bit.ly/askHOTD']
                return result
            case 'speak':
                result.hasMessage = true;
                result.isAction = true;
                result.items = ['BORK BORK']
                return result
            case 'lurk':
                result.hasMessage = true;
                result.isAction = true;
                result.items = [`${context.username} plops down on their doggy bed to take a nap.`]
                return result
            default:
                return result
        }
    }
}