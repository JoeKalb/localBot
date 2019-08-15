// bug: while backupbot is live, games cannot be activated in chat

let bottressDown = true;
const fs = require('fs');
const fetch = require('node-fetch');
const co = require('co');
const moment = require('moment')

let today = new Date();
let streamDay = `${today.getUTCMonth()+1}-${today.getDate()}`
let fileName = `logs/backupButtcoins.txt`

const user_id = '82523255'

recordButtcoins = (payout) => {
  fs.appendFile(fileName, `\n${streamDay} | ${payout}`, (err) => {
    if(err) throw err;
    console.log(`Buttcoins saved: ${payout}`)
  })
}

let pendingStatus;

module.exports = {
  isBottressDown: () => {
    return bottressDown
  },
  toggleBackupBot: () => {
    (bottressDown) ?
      bottressDown = false : bottressDown = true;
    return bottressDown
  },
  checkingBottressStatus: function(){
    console.log(`Checking Bot status`)
    pendingStatus = setTimeout(() => {
      console.log(`Bottress Status: Down`)
      bottressDown = true;
    }, 7000)
  },
  bottressStatusLive: function(){
    console.log(`Bottress Status: Live`)
    clearTimeout(pendingStatus)
    bottressDown = false;
  },
  BotHandler: (target, mod, commandName, parse, context) => {
    if(bottressDown && target == '#thabuttress'){
      console.log(commandName)
      switch(commandName){
        case 'discord':
          return `Join our offline Discord chat! Subs: Link your discord to your twitch account for bonus channels! https://discord.gg/YbdqmZG`
        case 'house':
          return `buttHouse If you want to join in on the Harry Potter fun go the the pottermore website http://bit.ly/2ETyXDB and post a screenshot your house in the #sorting_hat channel of the discord! https://discord.gg/j3G5bx3 buttHouse`
        case 'lego':
          return `Butt's built this 6020 piece Hogwarts Lego Set! https://amzn.to/2LEy7uE buttHouse https://clips.twitch.tv/AltruisticBreakableToadDuDudu`
        case 'nerds':
          return "You're all such nerds!!!"
        case 'gundam':
          return `If you're planning on buying a kit check out https://www.gundamplanet.com/ and use coupon code "THABUTTRESS" to get 10% off all regularly priced items!`
        case 'gundams':
          return `If you're planning on buying a kit check out https://www.gundamplanet.com/ and use coupon code "THABUTTRESS" to get 10% off all regularly priced items!`
        case 'imgur':
          return `Look at all these cool gundams that thaButtress has built and customized! https://thabuttress.imgur.com/ buttOMG`
        case 'built':
          return `Check out Butt's built list and backlog!!! https://goo.gl/7DxzVX buttDab`
        case 'playlist':
          return `Digging the current playlist? https://www.twitch.tv/relaxbeats`
        case 'tats':
          return `Here are all of butt's tattoos! https://imgur.com/a/Vd1iAMF`
        case 'subnight':
          return `IF YOU ARE A SUB...Subnights will be held every Friday! Make sure to join the !discord and download Kast: https://kast.gg/download.html buttSmug https://clips.twitch.tv/AbstemiousDeterminedSageFunRun`
        case 'earn':
          return `Ways to earn points for your house: Donations - $1=5pts Bits - 100=5pts Gifted Subs - 1=25pts Community Games buttHouse`
        case 'twitter':
          return `Butt's twitter: https://twitter.com/thaButtress`
        case 'socials':
          return `Twitter: https://twitter.com/thaButtress | Insta: https://instagram.com/thabuttress/ | YouTube: https://goo.gl/uIL66O | SnapChat: @thabuttress`
        case 'insta':
          return `Butt's Instagram: https://instagram.com/thabuttress/`
        case 'define':
          return `Buttress (noun) - a projecting support of stone or brick built against a wall`
        case 'snap':
          return `You can follow @thabuttress on snapchat but she only does add backs for T2 subs and above.`
        case 'lotto':
          return `Check out these Gundam Planet lotto winners! https://www.twitch.tv/videos/362520541`
        case 'dad':
          return `buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad`
        case 'morebuttress':
          return `Instagram https://goo.gl/Jf4v7U | Twitter https://goo.gl/y3gpVu | FaceBook https://goo.gl/kqIjiz | Patreon https://goo.gl/iDRnBW | Snapchat: thaButtress`
        case 'win':
          return `A donation of $10 gets your name into the Goblet of Fire! Each entry will be a ticket into a giveaway for the custom ButtCoin plus a lil extra something for the !top single donation! buttHouse`
        case 'top':
          return `The largest single donation by the 27th will get the chance to pick Butt's next Gundam + 500 points towards their house!`
        case 'breed':
          return `buttMonty Bet on the dog breeds! (Ex Monty: !monty pug 10) (Ex. Reggie: !reggie border_collie 10) **if the breed you want is more that one word use an "_" rather than a space! buttReggie`
        case 'job':
          return `Butt works at Twitch now! So she's livin' that SoCal lifestyle!`
        case 'work':
          return `Butt doesn't discuss job specifics during stream.`
        case 'schedule':
          return `New Stream Schedule buttOMG Tuesday/Wednesday Evenings, weekends TBA! Subnight are now every Friday!!!`
        case 'glue':
          return `Butt uses Tamiya Extra Thin Cement Glue https://amzn.to/2YdgxYw`
        case 'lurk':
          return `buttLurk ${context['display-name']} has turned set their mobile suit to stand-by mode buttLurk`
        case 'current':
          return `Butt's currently customzing an HG IBO Grimgerde into a Sauron Gundam buttOMG https://www.gundamplanet.com/hg-ibo-grimgerde.html`
        case 'newtype':
          return `Butt's gonna be a featured guest for Newtype Build Con Nov 16th & 17th buttOMG http://bit.ly/NTBCbuttress`
        case 'vip':
          return `How to get VIP for the month: Top Monthly Dono | Top Monthly Bits | $100 Dono | 10,000 Bits or Buttcoins | Forever VIP: 100 or more gifted subs!!!`
        case '1k':
          return `Butt just hit 1000 followers on youtube!!! Here's a video Pop made to celebrate it: https://youtu.be/nn51DLN9Esk`
        case 'followage':
          return co(function*(){
            try{
              let followage = yield fetch(`https://decapi.me/twitch/followage/thabuttress/${context.username}`)
              let response = yield followage.text()
              return `${context['display-name']} has been following thaButtress for ${response}`
            }
            catch(err){
              console.log(err)
              return `${context['display-name']} is not following buttThump`
            }
          })
        case 'uptime':
          return co(function*() {
            try{
              let res = yield fetch(`https://api.twitch.tv/helix/streams?user_id=${user_id}`, {
                headers:{
                  'Client-ID':'q9qpitg0qv8dujukht7g581ds0n5hx'
                }
              })
              let json = yield res.json()
              let now = moment(Date.now())
              let streamStart = moment(new Date(json.data[0].started_at))

              let hours = now.diff(streamStart, 'hours')
              let minutes = now.diff(streamStart, 'minutes') - (hours*60)

              return `Stream has been live for ${(hours > 0)? `${hours} hour${(hours === 1) ? '':'s'} and `:''} ${minutes} minute${(minutes === 1) ? '':'s'}.`
            }
            catch(err){
              console.log(err)
              return `Either this command is broken or the stream is not currently live.`
            }
          })
        case 'game':
          return co(function*(){
            try{
              let res = yield fetch(`https://api.twitch.tv/helix/streams?user_id=${user_id}`, {
                headers:{
                  'Client-ID':'q9qpitg0qv8dujukht7g581ds0n5hx'
                }
              })
              let json = yield res.json()
              const gameID = json.data[0].game_id

              try{
                let res = yield fetch(`https://api.twitch.tv/helix/games?id=${gameID}`, {
                  headers:{
                    'Client-ID':'q9qpitg0qv8dujukht7g581ds0n5hx'
                  }
                })
                let json = yield res.json()
                let game = json.data[0].name 
                return `Butt's currently streaming ${game}!`
              }
              catch(err){
                console.log(err)
                return `Looks like thaButtress isn't playing a game right now!`
              }
            }
            catch(err){
              console.log(err)
              return `Looks like thaButtress isn't currently streaming!`
            }
          })
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
                console.log(`Error !buttshout: ${err}`)
                return `Could not find broadcaster: ${broadcaster}`
              }
            })
          case 'buttcoins':
            try{
              let user = parse[2].replace('@', '')
              let payout = `${user} ${parse[1]} ${parse[3]}`
              recordButtcoins(payout)
              return `Recorded: ${payout}`
            }
            catch(err){
              console.log(err)
              return false;
            }
          default:
            //console.log(`Unknown mod command ${commandName}`)
            return false;
        }
      }
      console.log(`Should not be here: ${commandName}`)
      return false;
    }
  }
}

function createDateTimeBreakdown(utc){
  let dateTime = utc.split('T')
  let day = parseInt(dateTime[0].split('-')[2])
  let times = dateTime.split(':')
  let hour = parseInt(times[0])
  let minute = parseInt(times[1])
  return {
    day,
    hour,
    minute
  }
}