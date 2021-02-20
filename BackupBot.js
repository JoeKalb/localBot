// bug: while backupbot is live, games cannot be activated in chat

let bottressDown = false;
const fs = require('fs');
const fetch = require('node-fetch');
const co = require('co');
const moment = require('moment')

let today = new Date();
let streamDay = `${today.getUTCMonth()+1}-${today.getDate()}`
let fileName = `logs/backupButtcoins.txt`

const user_id = '82523255'

let recordButtcoins = (payout) => {
  fs.appendFile(fileName, `\n${streamDay} | ${payout}`, (err) => {
    if(err) throw err;
    console.log(`Buttcoins saved: ${payout}`)
  })
}

let pendingStatus;

module.exports = {
  recordButtcoins: (payout) => {
    recordButtcoins(payout)
  },
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
      //console.log(`Command Used: ${commandName}`)
      switch(commandName){
        case 'raffle':
          return `Use your buttcoins in the streamlabs extension to possibly win a poster! Make sure to submit a memory of the stream or of Butt.`
        case 'lego':
          return `Butt's built this 6020 piece Hogwarts Lego Set! https://amzn.to/2LEy7uE buttHouse https://clips.twitch.tv/AltruisticBreakableToadDuDudu`
        case 'nerds':
          return "You're all such nerds!!!"
        case 'gundam':
          return `Want to build your own gundam?? thaButtress gets all her model kits and buttHella tools here at Gundam Planet gundamplanet.com buttDab Use code "thabuttress" at checkout to get 10% off all regular priced items!`
        case 'gundams':
          return `Want to build your own gundam?? thaButtress gets all her model kits and buttHella tools here at Gundam Planet gundamplanet.com buttDab Use code "thabuttress" at checkout to get 10% off all regular priced items!`
        case 'imgur':
          return `Look at all these cool gundams that thaButtress has built and customized! https://imgur.com/user/thabuttress buttOMG`
        case 'built':
          return `Click here for a list of all tha gundams that thaButtress has built as well as her backlog! https://goo.gl/YWZGde`
        case 'tats':
          return `Here are all of butt's tattoos! https://imgur.com/a/Vd1iAMF`
        case 'subnight':
          return `IF YOU ARE A SUB...Subnights will be held ever other Friday! Make sure to join the !discord buttSmug https://clips.twitch.tv/AbstemiousDeterminedSageFunRun`
        case 'anime':
          return `ANIME NIGHTS ARE BACK! buttOMG Every week on Thursdays T2+ subs will be watching an anime show or movie together in Discord! We're going to start a new show this week! Don't forget to join the !discord`
        case 'twitter':
          return `Butt's twitter: https://twitter.com/thaButtress`
        case 'morebuttress':
          return `Instagram https://goo.gl/Jf4v7U | Twitter https://goo.gl/y3gpVu | Patreon https://goo.gl/iDRnBW | Snapchat: thaButtress | tiktok: https://www.tiktok.com/@thabuttress/`
        case 'insta':
          return `Butt's Instagram: https://instagram.com/thabuttress/`
        case 'define':
          return `Buttress (noun) - a projecting support of stone or brick built against a wall`
        case 'name':
          return `Buttress was given her name as a joke, which inevitably stuck....but it works! thaButtress "buttresses" thaButtCrew!! (plus butts are great, yeah!?)`
        case 'home':
          return `thaButtress is moving back home to KC!! Personal letters will be going out to those that donate $50 or more before the end of Feb!`
        case 'snap':
          return `You can follow @thabuttress on snapchat but she only does add backs for T2 subs and above.`
        case 'dad':
          return `buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad`
        case 'love':
          return `buttLove buttLove buttLove buttLove buttLove buttLove buttLove buttLove buttLove buttLove buttLove buttLove buttLove buttLove buttLove buttLove buttLove`
        case 'morebuttress':
          return `Instagram https://goo.gl/Jf4v7U | Twitter https://goo.gl/y3gpVu | FaceBook https://goo.gl/kqIjiz | Patreon https://goo.gl/iDRnBW | Snapchat: thaButtress`
        case 'job':
          return `Butt works at Twitch now! So she's livin' that SoCal lifestyle!`
        case 'work':
          return `Butt doesn't discuss job specifics during stream.`
        case 'schedule':
          return `Monday, Friday, and Sunday evenings with Sub/Anime nights on Friday in the !discord buttHype (schedule subject to change)`
        case 'glue':
          return `Butt uses Tamiya Extra Thin Cement Glue https://amzn.to/2YdgxYw`
        case 'lurk':
          return `buttLurk ${context['display-name']} has set their mobile suit to stand-by mode buttLurk`
        case 'current':
          return `Butt's currently building the PG 00 Gundam Seven Sword buttDab https://www.gundamplanet.com/pg-gn-0000-7s-00-gundam-seven-sword-g.html?c=CAvHeI&referring_service=link`
        case 'newtype':
          return `Butt was a featured guest for Newtype Build Con! buttOMG http://bit.ly/NTBCbuttress`
        case 'vip':
          return `How to get VIP for the month: Top Monthly Dono | Top Monthly Bits | $100 Dono | 10,000 Bits or Buttcoins | Forever VIP: 100 or more gifted subs!!!`
        case '1k':
          return `Butt just hit 1000 followers on youtube!!! Here's a video Pop made to celebrate it: https://youtu.be/nn51DLN9Esk` 
        case 'bday':
          return `Butt's Birthday is on October 10th!!! Want to get her a gift? Check out her wishlist: a.co/7qE8gqN`
        case 'link':
          return `No links in chat, but you're welcome to post them in the discord! https://discord.gg/YbdqmZG`
        case 'discord':
          return `Join our offline Discord chat! Subs: Link your discord to your twitch account for bonus channels! https://discord.gg/YbdqmZG`
        case 'breathe':
          return `Let the Brain Goblins' Energy Drinks wear off--Take a Deep Breath and feel the calm.`
        case 'buttcoins':
          return `Since thaBottress is down I can't get your current buttcoins.`
        case 'buttsnips':
          return `Here are the Tamiya Nippers that Butt uses for her builds! buttLurk https://amzn.to/393uoF2`
        case 'coop':
          return `buttNo buttNo buttNo BIRTHDAY buttNo buttNo buttNo BIRTHDAY buttNo buttNo buttNo BIRTHDAY buttNo buttNo buttNo BIRTHDAY buttNo buttNo buttNo BIRTHDAY buttNo buttNo buttNo BIRTHDAY buttNo buttNo buttNo`
        case 'count':
          return `Kits complete in 2021: 9 buttDab`
        case 'dad':
          return `buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad`
        case 'drop':
          return `Buttress flips her Mega Size Gundam: https://clips.twitch.tv/ArtisticDirtySamosaOpieOP`
        case 'fall':
          return `thaButtFall: https://clips.twitch.tv/UglyDistinctPanKreygasm`
        case 'flex':
          return `https://clips.twitch.tv/IncredulousTolerantTrollTebowing`
        case 'gc':
          return `buttOMG Guilty is Butt's friend and a fellow streamer! You can follow her here: https://www.twitch.tv/guiltycosplay`
        case 'globe':
          return `Check out Butt's latest custom Snowglobe Strike Freedom buttDab http://bit.ly/SDSnowFreedom`
        case 'glue':
          return `https://clips.twitch.tv/RenownedTameCakeKeyboardCat`
        case 'hallo':
          return `buttReggie https://twitter.com/ThaButtress/status/1031661395459407872`
        case 'horse':
          return `https://www.twitch.tv/thabuttress/clip/TalentedLittleSalamanderKappa`
        case 'hydrate':
          return `Drink Water!`
        case 'KC':
          return `Back to KC again!!!`
        case 'lego':
          return `Butt's built this 6020 piece Hogwarts Lego Set! https://amzn.to/2LEy7uE buttHouse https://clips.twitch.tv/AltruisticBreakableToadDuDudu`
        case 'link':
          return `Sorry, thaBottress likes to delete comments that have a period followed immediately by a letter. She thinks it's a link! Try again!`
        case 'luna':
          return `She's my best friend and also a twitch partner broadcaster!!!! Make sure to follow LunaLyrik <3 www.twitch.tv/LunaLyrik`
        case 'merch':
          return `buttSmug Butt has a new merch shop! Check it out! https://streamlabs.com/thabuttress/merch`
        case 'mobilesub':
          return `Want to sub on mobile! CLICK HERE: https://www.twitch.tv/products/thabuttress`
        case 'monty':
          return `Monty is 50% chihuahua and 50% batdog(mixed breeds)! https://clips.twitch.tv/ClearConfidentMosquitoChefFrank`
        case 'nippers':
          return `Gundam Planet just got their custom side cutters back in stock buttOMG http://bit.ly/GP_Nippers`
        case 'paint':
          return `Butt uses Vallejo Game Air Paints! https://amzn.to/2kfvOFt`
        case 'panelwashing':
          return `This is the current panel washing pledge: https://www.walmart.com/ip/Pledge-Floor-Gloss-Original-27-Fluid-Ounces/15136693`
        case 'patreon':
          return `Want to support thaButtress & tha buttButt buttCrew ?? Check out the patreon! (There's perks!) https://www.patreon.com/thabuttress`
        case 'pg':
          return `https://clips.twitch.tv/BeautifulImpartialLobsterKAPOW`
        case 'plastics':
          return `These are all the plastic sheets that Butt uses: https://www.twitch.tv/videos/292777912`
        case 'popi':
          return `https://soundcloud.com/sloppypopi/sets/the-life-of-popi`
        case 'puppy':
          return `https://clips.twitch.tv/FrigidAcceptableLyrebirdLeeroyJenkins`
        case 'reggie':
          return `Reggie is 25% Border Collie and a whole lot of other things! https://clips.twitch.tv/BlazingSourChipmunkPJSalt`
        case 'sauce':
          return `What does Butt do in her spare time? Check out her latest video with Billy the Fridge! https://youtu.be/E8U0ZRtL6N8`
        case 'sauron':
          return `Check out Butt's HG Grimgerde - Sauron Custom: https://imgur.com/gallery/weQL4B5`
        case 'specs':
          return `Butt just built a new PC with an Intel i7-8700, GTX 1060 6GB, and 16GB DDR4-3000 buttOMG Here's the full parts list: https://pcpartpicker.com/list/LFHYfH`
        case 'spawn':
          return `Check out this dope Spawn kit that Butt built!!! buttOMG https://twitter.com/thaButtress/status/1237121514178142209?s=20`
        case 'sub':
          return `buttLurk Perks? buttOMG Perks?? buttWut Perks??? Get yourself a monty emote buttMonty & buttHella perks listed here! Sub before the 1st to get the following month's rewards! https://bit.ly/2Fu2q6o`
        case 'tats':
          return `Here are all of Butt's tatttoos buttButt buttRess https://imgur.com/a/Vd1iAMF`
        case 'tiktok':
          return `Go Follow! https://www.tiktok.com/@thabuttress/`
        case 'treatstream':
          return `buttSmug ya wanna buy a girl some wings?!? http://treatstream.com/t/treat/thabuttress`
        case 'vampire':
          return `https://clips.twitch.tv/KnottyThirstySoymilkSeemsGood`
        case 'watermelon':
          return `WATERMELON! http://www.twitch.tv/thabuttress/v/12129711`
        case 'youtube':
          return `Subscribe to ThaButtress on YouTube for highlights! https://goo.gl/uIL66O`
        case 'ytreggie':
          return `Reggie's been chillin with Butt for an entire year buttReggie Check out all these clips of her on stream https://youtu.be/ATxcNacbt_Q`
        case 'zaku':
          return ` Look at this sweet gundam clothing! http://zakuaurelius.storenvy.com/`
        case 'followage':
          return co(function*(){
            try{
              let followage = yield fetch(`https://decapi.me/twitch/followage/thabuttress/${context.username}`)
              let response = yield followage.text()
              return `${context['display-name']} has been following for ${response}!`
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

              return `Buttress has been piloting the stream for ${(hours > 0)? `${hours} hour${(hours === 1) ? '':'s'} and `:''} ${minutes} minute${(minutes === 1) ? '':'s'}.`
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
        case 'time':{
          const now = moment(Date.now())
          let hours = now.hours()
          const ampm = (hours >= 12)?'PM':'AM' 
          hours = hours%12
          hours = (hours === 0) ? 12:hours

          return `It is currently ${hours}:${now.minutes()} ${ampm} Buttress Standard Time`
        }
        case 'retweet':
          return co(function*(){
            try{
              let res = yield fetch(`https://decapi.me/twitter/latest_url/thabuttress?shorten=true&no_rts=true`)
              let tweet = yield res.text()

              return `4 out of 5 doctors agree that retweeting thaButtress is good for your health! ${tweet}`
            }
            catch(err){
              console.log(err)
              return `Could not get latest tweet buttThump`
            }
          })
        case 'emotes':
          return co(function*(){
            try{
              let res = yield fetch(`https://api.twitchemotes.com/api/v4/channels/${user_id}`)
              let json = yield res.json()

              let message = ''
              json.emotes.forEach(emote => {
                message += `${emote.code} `
              })

              return message
            }
            catch(err){
              console.log(err)
              return `Can't find the emotes buttThump`
            }
          })
        case 'lookout':
          return co(function *(){
            try{
              let res = yield fetch(`https://tmi.twitch.tv/group/user/thabuttress/chatters`)
              let json = yield res.json()
              //console.log(json)
              const { staff } = json.chatters
              if(staff.length > 0){
                return `Check out these cool twitch staff in the chat! ${staff.join(', ')}`
              }
              else
                return `I don't see any staff in the chat... but I could be wrong!`
            }
            catch(err){
              console.log(err)
              return `Viewer List is currently unavailable...`
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

// !buttcoins add Aborawatabinov 100
// !buttcoins add ansinex726 100
// !buttcoins add ansinex726 100
// !buttcoins add tonekathsu 100