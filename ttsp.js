const commandPrefix = '!';
const response = require('./models/response')
const fetch = require('node-fetch')
const dotenv = require('dotenv').config();
const moment = require('moment')
let backup = false;

module.exports = {
    channel:"#thethingssheplays",
    handelMessage:async (context, msg) => {
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

        if(await isBanable(context.username, msg)){
            result.ban = true
            result.banName = context.username
            result.items = [`I don't want to become famous!`]
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

let checked = []

const isBanable = async (username, msg) => {
    //Wanna become famous? Buy followers, primes and views on
    //console.log(username, msg)
   
    if(!checked.includes(username) && msg.match(/Wanna become famous\? Buy followers, primes and views on/i)){
        console.log(true)
        const res = await fetch(`https://api.twitch.tv/kraken/users?login=${username}`,{
            headers:{
                'Client-ID':process.env.TWITCH_CLIENT,
                'Accept':'application/vnd.twitchtv.v5+json'
            }
        }).catch(console.error)
        const json = await res.json()

        checked = [...checked, username]

        const accountAge = moment(json.users[0].created_at).toNow(true)
        if(accountAge.match(/seconds|minute|hour|day/g)){
            return true
        }
    }

    return false
}