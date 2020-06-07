const fetch = require('node-fetch')
const response = require('./models/response')
const commandPrefix = '!';
const dotenv = require('dotenv').config();

module.exports = {
    channel:'#lunalyrik',
    handleMessage:async (context, msg) => {

        await gatherUsers(context.username)

        let result = Object.assign({}, response)
        return result
    }
}

let userDateCreateMap = {

}

let tempUsernames = []
let gatherUsers = async (username) => {
    if(!userDateCreateMap.hasOwnProperty(username) && !tempUsernames.includes(username)){
        tempUsernames = [...tempUsernames, username]
    }

    if(tempUsernames.length === 10){
        /* let res = await fetch(`https://api.twitch.tv/kraken/users?login=${tempUsernames.join(',')}`, {
            headers:{
                'Accept':'application/vnd.twitchtv.v5+json',
                'Client-ID':process.env.TWITCH_CLIENT
            }
        }).catch(console.error)
        let json = await res.json().catch(console.error)

        if(json.hasOwnProperty(users)){
            json.users.forEach(user => {
                userDateCreateMap[user.name] = user.created_at
            })

            tempUsernames = []
        } */
    }
}