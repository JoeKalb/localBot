let bottressDown = false;
const fs = require('fs');
const fetch = require('node-fetch');
const co = require('co');

let today = new Date();
let streamDay = `${today.getUTCMonth()+1}-${today.getDate()}`
let fileName = `logs/backupButtcoins.txt`

recordButtcoins = (payout) => {
  fs.appendFile(fileName, `\n${streamDay} | ${payout}`, (err) => {
    if(err) throw err;
    console.log(`Buttcoins saved: ${payout}`)
  })
}

module.exports = {
  isBottressDown: () => {
    return bottressDown
  },
  toggleBackupBot: () => {
    (bottressDown) ?
      bottressDown = false : bottressDown = true;
    return bottressDown
  },
  BotHandler: (target, mod, commandName, parse) => {
    if(bottressDown && (target == '#thabuttress' || target == '#joefish5')){
      switch(commandName){
        case 'discord':
          return `All people are welcome to join the discord, and subs get access to special channels!!! https://discord.gg/j3G5bx3`
        case 'house':
          return `buttHouse If you want to join in on the Harry Potter fun go the the pottermore website http://bit.ly/2ETyXDB and post a screenshot your house in the #sorting_hat channel of the discord! https://discord.gg/j3G5bx3 buttHouse`
        case 'lego':
          return `Butt's on the final day of building the 6020 piece Hogwarts Lego Set! https://amzn.to/2LEy7uE buttHouse`
        case 'nerds':
          return "You're all such nerds!!!"
        case 'gundam':
          return `If you're planning on buying a kit check out https://www.gundamplanet.com/ and use coupon code "THABUTTRESS" to get 10% off all regularly priced items!`
        case 'imgur':
          return `Look at all these cool items that thaButtress has built and customized! https://imgur.com/user/ThaButtress buttOMG`
        case 'built':
          return `Check out Butt's built list and backlog!!! https://goo.gl/7DxzVX buttDab`
        case 'playlist':
          return `Digging the current playlist? https://www.twitch.tv/relaxbeats`
        case 'tats':
          return `Here are all of butt's tattoos! https://imgur.com/a/Vd1iAMF`
        default:
          if(!mod)
            return false;
      }
      if(mod){ // mod only commands
        //console.log(commandName)
        switch(commandName){
          case 'buttshout':
            return co(function *() {
              let broadcaster = parse[1].replace('@', '')
              try{
                let twitchLogin = yield fetch(`https://api.twitch.tv/kraken/users?login=${broadcaster}`, {
                  headers: {
                    'Client-ID' : 'q9qpitg0qv8dujukht7g581ds0n5hx',
                    'Accept': 'application/vnd.twitchtv.v5+json'
                  }
                })
                let twitchUser = yield twitchLogin.json();
                let channelInfo = yield fetch(`https://api.twitch.tv/kraken/channels/${twitchUser.users[0]._id}`, {
                  headers: {
                    'Client-ID' : 'q9qpitg0qv8dujukht7g581ds0n5hx',
                    'Accept': 'application/vnd.twitchtv.v5+json'
                  }
                })
                let json = yield channelInfo.json();
                
                let message = `buttHype Yo yo the homie ${json.display_name} stopped by! Their last stream was ${json.game} so be sure to check them out and give them a follow!!! ${json.url.replace(' https://www.', '')}`
                //console.log(`Buttshout message: ${message}`)
                return message
              }
              catch(err){
                console.log(`Error status from !buttshout: ${err}`)
                return `Could not find broadcaster: ${broadcaster}`
              }
            })
          case 'buttcoins':
            let user = parse[2].replace('@', '')
            let payout = `${user} ${parse[1]} ${parse[3]}`
            recordButtcoins(payout)
            return `Recorded: ${payout}`
          default:
            //console.log(`Unknown mod command ${commandName}`)
            //return false;
        }
      }
    }
    //return false;
  }
}