const co = require('co')
const fetch = require('node-fetch')
const fs = require('fs')

let displayNames = JSON.parse(fs.readFileSync('displayNames.json'))

module.exports = {
  houseNames: ["Gryffindor", "Hufflepuff", "Slytherin", "Ravenclaw"],
  students:{ 
    joefish5:0,
    oi_atomsk_io:2,
    danyrddaspanyrd:2,
    coop3r:3,
    thabuttress:2,
    witchychar:2,
    minovskyflight:1,
    theshyguy69:1,
    maverick825:3,
    grantypants:2,
    majintb:3,
    tonyvirgo:3,
    tripleb85:1,
    mythicalmonkey:2,
    donutscurecancer:1,
    garebear_:3,
    patrioticgrizzly:0,
    sauron2513:0,
    phorr:1,
    jarito180:2,
    trappmastuh:3,
    dinobrutalityx:3,
    ryokoie:2,
    makeetea: 0,
    yuudachi_san:0,
    streamline72:2,
    cjoflannel:0,
    zophkiel:2,
    sp4cem0nkey:2,
    zombocarnie:0,
    jeddkay:2,
    tawhite2720:2,
    verlin:3,
    cluelessgamer151:2,
    bigboss138:2,
    antonioreyx360:0,
    nebhusk32:3,
    darkfrytepanda:2,
    annakyns:3,
    jijeryfrits:1,
    pixelcruncher:0,
    popthatbabymaker:0,
    aofool:3,
    mistaken_miracles:2,
    thisroguelife:0,
    eneeliak:2,
    psn_centralpark:0,
    eladolo:0,
    ezegen:0,
    eddiethamd:2,
    blackdawn1980:2,
    periculum9:0,
    drdrinks420:3,
    hgeezy:1,
    acjc21:0,
    darkhatchet7000:2,
    whatupitsean:1,
    sammypno9:0,
    nodicemike:2,
    agentsnapcrackle:3,
    pupper8490:2,
    dragon1785:2,
    espioakakeith:2,
    duskguard:3,
    aleistercrowwley:3,
    viperstrikelol:3,
    taxikab86:0,
    chrisofbodom:0,
    silverstray:2,
    bobert_r:3,
    chrissmith147:0,
    alchahest:0,
    lolghostface:0,
    dtricks42:3,
    twask3v1n:1,
    thatzigygirl:3,
    mac_drachma:1,
    vfx10viper:3,
    cinerdella:2,
    krzykorean87:2,
    datfazbear:1,
    aardvarkpepper:3,
    edgeblade31:0,
    halfwingseen:2,
    monthis:2,
    unitymind:3,
    deven9484:3,
    thepaintmonkey:0,
    lostfoxman:1,
    krivas95:1,
    inquisitorburnzy:3,
    lumberjackdann:0,
    ekkonexus:1,
    nzstephenf:1,
    captaindaikyo:3,
    tsmax17:0,
    jimmytheguz:0,
    neumie92:2,
    mal5305:1,
    truedarkdogg:2,
    arkaynan:1,
    reiner72:0,
    itszenoox:3,
    carmillawoo:2,
    chadthachillest:0,
    henrynighthawk:1,
    admisan:2,
    reynte:3,
    deem518:0,
    heroic_piplup:2,
    firstman1978:0,
    bostontom:1,
    pandaloreart:3,
    wookie:1,
    actionba5tard:0,
    biggiesnacks:2,
    scarid:1,
    sleeping_quill:2,
    nimasho:3,
    realsarge198:0,
    gsoultaker:3,
    billdit:0,
    coldasiceii:1,
    du5tiin:3,
    dafallancaptain:3,
    drooyoo:0,
    blacklance:3,
    kjedi:3,
    blackjax:3,
    probit:3,
    castorr91:3,
    poidasmall:2,
    pickledeggz:1,
    samj30:3,
    ace0fjacks:2,
    j_skittah:1,
    roulette_king_yeti:3,
    fleetwood619:3,
    liingy:0,
    syl_x:1,
    ms85_hart: 3,
    micktrinus:2,
    garceaj:1,
    numbzeh:0,
    abbyfabby:0,
    undead_artist:3,
    grunderslacks:1,
    ashcadelanne:1,
    darthghostface:0,
    hildeblue:1,
    goaliezer0:0,
    axlyin:3,
    superkirby77:1,
    chill0862:2,
    mbergman22:2,
    fenrysk:3,
    yessiocho:3,
    thelasthamster:2,
    tyrantsxblood:0,
    jackiesimi:3,
    drod262:3,
    billwilliams1981:1,
    missing_link:1,
    toon_decree:1,
    airbrush_wizard:0,
    kgunnzxraven_:0,
    goldsquadronrebel:3,
    anomulus0:2,
    benefitoftheclout:2,
    kennethmyers:0,
    eroot:0,
    gmpleiades:3,
    eyequeuex:3,
    mysteracles:2,
    thedrummergirl:1
    //gryf = 0, huff = 1, sly = 2, raven = 3
  },
  getHouse: function(name){
    let check = name.toLowerCase();
    let result = name;
    (this.students.hasOwnProperty(check)) ?
      result += ` is in ${this.houseNames[this.students[check]]}!`:
      result += " has no !house yet!"
    return result
  },
  getHouseName:function(name){ //name must already be lower case
    if(this.students.hasOwnProperty(name))
      return `${this.houseNames[this.students[name]]}`
    return false;
  },
  classSizesArray: function(){
    let classCount = [0, 0, 0, 0]
    for(let key in this.students)
      ++classCount[this.students[key]]

    return classCount
  },
  classSizes: function(){
    let classCount = [0, 0, 0, 0]
    for(let key in this.students)
      ++classCount[this.students[key]]

    let result = "Current Class Sizes|"
    for(let i in this.houseNames)
      result += ` ${this.houseNames[i]}: ${classCount[i]} |`

    result += ` ${classCount[0] + classCount[1] 
      + classCount[2] + classCount[3]} Total Students buttOMG`
    return result
  },
  isEnrolled: function(name){
    return this.students.hasOwnProperty(name.toLowerCase());
  },
  myHouse:function(name){
    let lowName = name.toLowerCase()
    if(this.students.hasOwnProperty(lowName)){
      let result = `Students in 
        ${this.houseNames[this.students[lowName]]} with ${name}! `
      let house = this.students[lowName]
      let allNames = Object.keys(this.students);
      let totalStudents = allNames.length;
      
      for(let i = 0; i < totalStudents; ++i){
        if(this.students[allNames[i]] === house && allNames[i] != lowName){
          result += ` ${allNames[i]} |`;
        }
      }
      return result;
    }
    return `Sorry ${name} doesn't have a !house yet!`;
  },
  allHouse:function(houseNum){
    let students = `Students in ${this.houseNames[houseNum]}:`
    let allNames = Object.keys(this.students)

    for(let i in allNames){
      if(this.students[allNames[i]] === houseNum)
        students += ` ${allNames[i]} |`
    }

    return students
  },getDisplayName:function(name){
    if(displayNames.hasOwnProperty(name))
      return displayNames[name]
    
    try{
      return co(function *() {
        let twitchLogin = yield fetch(`https://api.twitch.tv/kraken/users?login=${name}`, {
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
        let json = yield channelInfo.json()

        displayNames[name] = json.display_name;
        fs.writeFileSync("displayNames.json", JSON.stringify(displayNames))
        return displayNames[name]
      })
    } 
    catch(err){
      console.log(err)
      console.log(`Could not find display name: ${name}`)
      return name;
    }
  },setDisplayName:function(userName, newDisplayName){
    if(this.students.hasOwnProperty(userName)){
      if(!displayNames.hasOwnProperty(userName)){
        displayNames[userName] = newDisplayName
        fs.writeFileSync("displayNames.json", JSON.stringify(displayNames))
      }
    }
  },
  specificHouseStudents:function(houseNum){
    let results = `Students in ${this.houseNames[houseNum]}:`
    let allNames = Object.keys(this.students)

    for(let name of allNames){
      if(this.students[name] === houseNum)
        results += ` ${name} |`
    }

    return results
  }
}