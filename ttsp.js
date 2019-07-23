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

let backup = false;

module.exports = {
    channel:"#thethingssheplays",
    handelMessage:(context, msg) => {
        let result = Object.assign({}, response)
        result.items = []
        
        if((context.mod || context.username === 'thethingssheplays') 
            && msg === '!backup'){
            (backup) ? backup = false : backup = true;
            result.hasMessage = true;
            result.items = [
                `Backup commands are now ${(backup) ? 'on':'off'}.`
            ]
            return result;
        }

        if(msg.substr(0,1) !== commandPrefix || !backup)
            return result;

        const parse = msg.slice(1).split(' ')
        const commandName = parse[0]

        switch(commandName){
            case 'discord':
                result.hasMessage = true;
                result.items = [`Come hang out in the discord! https://discordapp.com/invite/jpR8f6n`]
                break;
            case 'twitter':
                result.hasMessage = true;
                result.items = [`Tweetar: https://twitter.com/ThingsSheTweets`]
                break;
            case 'insta':
                result.hasMessage = true;
                result.items = [`Insta: https://www.instagram.com/thingsshedraws/`]
                break;
            case 'instagram':
                result.hasMessage = true;
                result.items = [`Insta: https://www.instagram.com/thingsshedraws/`]
                break;
            case 'yt':
                result.hasMessage = true;
                result.items = [`Sara's YouTube: https://www.youtube.com/c/TheThingsShePlays`]
                break;
            case 'youtube':
                result.hasMessage = true;
                result.items = [`Sara's YouTube: https://www.youtube.com/c/TheThingsShePlays`]
                break;
            case 'merch':
                result.hasMessage = true;
                result.items = [`Wanna rep some Thump Nation Merch! https://www.designbyhumans.com/shop/TheThingsShePlays/`]
                break;
            default:
        }

        return result;
    },
    cheerHandler:(userstate, msg) => {
        //console.log(userstate)
        //console.log(msg)
    }
}