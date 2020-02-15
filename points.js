const fs = require('fs')
let students = {"joefish5":0,"oi_atomsk_io":2,"danyrddaspanyrd":2,"witchychar":2,"thabuttress":2,"coop3r":3,"minovskyflight":1,"majintb":3,"theshyguy69":1,"maverick825":3,"tonyvirgo":3,"patrioticgrizzly":0,"dinobrutalityx":3,"tripleb85":1,"cjoflannel":0,"tawhite2720":2,"trappmastuh":3,"streamline72":2,"nebhusk32":3,"popthatbabymaker":0,"jeddkay":2,"mythicalmonkey":2,"antonioreyx360":0,"psn_centralpark":0,"phorr":1,"makeetea":0,"periculum9":0,"pixelcruncher":0,"sp4cem0nkey":2,"whatupitsean":1,"eneeliak":2,"donutscurecancer":1,"jarito180":2,"blackdawn1980":2,"cluelessgamer151":2,"dragon1785":2,"darkhatchet7000":2,"annakyns":3,"yuudachi_san":0,"taxikab86":0,"garebear_":3,"pupper8490":2,"alchahest":0,"mistaken_miracles":2,"zombocarnie":0,"sauron2513":0,"ezegen":0,"viperstrikelol":3,"mac_drachma":1,"bigboss138":2,"hgeezy":1,"ryokoie":2,"chrissmith147":0,"jijeryfrits":1,"aardvarkpepper":3,"nodicemike":2,"thisroguelife":0,"zophkiel":2,"deven9484":3,"thatzigygirl":3,"lumberjackdann":0,"duskguard":3,"datfazbear":1,"verlin":3,"eddiethamd":2,"silverstray":2,"darkfrytepanda":2,"unitymind":3,"acjc21":0,"jimmytheguz":0,"reiner72":0,"aofool":3,"inquisitorburnzy":3,"dtricks42":3,"agentsnapcrackle":3,"admisan":2,"aleistercrowwley":3,"tsmax17":0,"cinerdella":2,"eladolo":0,"halfwingseen":2,"bostontom":1,"arkaynan":1,"bobert_r":3,"drdrinks420":3,"sammypno9":0,"lostfoxman":1,"henrynighthawk":1,"scarid":1,"twask3v1n":1,"espioakakeith":2,"firstman1978":0,"nzstephenf":1,"krzykorean87":2,"billdit":0,"chrisofbodom":0,"biggiesnacks":2,"mal5305":1,"monthis":2,"gsoultaker":3,"blacklance":3,"lolghostface":0,"krivas95":1,"carmillawoo":2,"drooyoo":0,"poidasmall":2,"deem518":0,"captaindaikyo":3,"vfx10viper":3,"edgeblade31":0,"roulette_king_yeti":3,"castorr91":3,"wookie":1,"truedarkdogg":2,"nimasho":3,"thepaintmonkey":0,"j_skittah":1,"micktrinus":2,"chadthachillest":0,"du5tiin":3,"heroic_piplup":2,"ms85_hart":3,"ekkonexus":1,"grunderslacks":1,"actionba5tard":0,"neumie92":2,"undead_artist":3,"blackjax":3,"axlyin":3,"itszenoox":3,"realsarge198":0,"goaliezer0":0,"yessiocho":3,"samj30":3,"dafallancaptain":3,"reynte":3,"fenrysk":3,"billwilliams1981":1,"liingy":0,"pandaloreart":3,"drod262":3,"probit":3,"numbzeh":0,"goldsquadronrebel":3,"darthghostface":0,"kgunnzxraven_":0,"gmpleiades":3,"ace0fjacks":2,"sleeping_quill":2,"syl_x":1,"eroot":0,"coldasiceii":1,"crelca":0,"chill0862":2,"kjedi":3,"tyrantsxblood":0,"abbyfabby":0,"cloudsavegaming":1,"ulluki":1,"pickledeggz":1,"toon_decree":1,"beardsofprey":2,"hildeblue":1,"milkham":1,"mensanurse":2,"benefitoftheclout":2,"fleetwood619":3,"daaybot":2,"mbergman22":2,"garceaj":1,"mysteracles":2,"ansinex726":0,"jackiesimi":3,"zackrobotheart":2,"pgdmystic":2,"ashcadelanne":1,"zabanya91":0,"josh_ortega":2,"airbrush_wizard":0,"tiagorb26":1,"yaritstony":3,"superkirby77":1,"srn0va":1,"kennethmyers":0,"thelasthamster":2,"thedrummergirl":1,"biscuitboyusa":3,"lord_mangoat":2,"zraveno":1,"missing_link":1,"itscharmazing":2,"guiltycosplay":3,"darkhatchet600":2,"anomulus0":2,"pr3stss":1,"drago_x172":3,"lfg_joey":1,"nilstryfe":1,"eyequeuex":3,"been_jammin245":0,"samasulee":0,"fittzle16":3,"helladerpy":1,"slickbuilder":3,"xshrimpx":3,"therisenone247":3,"agentjohnny47":3,"harbortownhobbies":1,"flyingpainguin":0,"lemongrenade":2,"tribalgrayfox":3,"thefryingpan":1,"ralkor_targaryen":3,"garzey":1,"kahhlie":2,"difumino":3,"griffihn":0,"merviking":2,"binaryruse":2,"loocian":0,"robertgoodnight":2,"thethingssheplays":0,"kwa_bena":3,"type_40_":0,"rincewindlive":3,"mercdoty":2,"tiago_rb26":1,"ilikeagoodbum":1,"clippinubs":1,"greilark":0}

const path = 'logs/hp/thabuttress'
let allLogs;

fs.readdir(path, (err, files) => {
    if(err)
        console.log(err)
    else{
        allLogs = files
        chatStats(allLogs)
    }
})

let chatMessageCount = [0, 0, 0, 0]
let nonCommandMessages = [0,0,0,0]

let snitchesByHouse = [0, 0, 0, 0]
let totalQuidditchPoints = [0,0,0,0]

let hasCheered = {}
let houseCheers = [0, 0, 0, 0]
let houseUniqueCheer = [0, 0, 0, 0]

let hangmanByHouse = [0, 0, 0, 0]

let duelsParticipatedByHouse = [0, 0, 0, 0]
let duelsWonByHouse = [0, 0, 0, 0]
let duelTotalPoints = [0,0,0,0]

let randomNumWinner = {}
let randomNumWinnerByHouse = [0, 0, 0, 0]

let currentClassSizes = [16, 7, 21, 12]

let totalHuntPoints = [0,0,0,0]

let wings = [0,0,0,0]
let pups = [0,0,0,0]

let chatStats = (files) => {
    let comments;
    let allSeekers = []

    let regexSnitch = RegExp('caught the Golden Snitch', 'g');
    let regexHangman = RegExp('The winner is ', 'g');
    let regexDuelWin = RegExp(' won the duel! ', 'g')
    let regexDuelHasChallenged = RegExp(' has challenged ', 'g')
    let regexDuelChosen = RegExp('The Duelists have been chosen!', 'g')
    let regexRandomNum = RegExp('wins! The correct number was', 'g')
    let regexResults = RegExp('Results', 'g')
    let regexPayouts = RegExp('Payouts', 'g')
    let regexStudents = RegExp('Current Class Sizes', 'g')
    let regexQuid = RegExp(`Quidditch Results: `, 'g')
    let regexDuel = RegExp('House payouts', 'g')
    let regexWings = RegExp('Wings', 'g')
    let regexwings = RegExp('wings', 'g')
    let regexReggie = RegExp('buttReggie', 'g')
    let regexMonty = RegExp('buttMonty', 'g')

    files.map((file) => {
        comments = JSON.parse(fs.readFileSync(`${path}/${file}`)).comments
        comments.map((comment) => {
            // most chat messages
            if(students.hasOwnProperty(comment.commenter.name)){
                ++chatMessageCount[students[comment.commenter.name]]

                if(comment.message.body[0] !== '!')
                    ++nonCommandMessages[students[comment.commenter.name]]
            }

            // quidditch snitch breakdown
            if(comment.commenter.name == 'botfish5' && regexSnitch.test(comment.message.body)){
                allSeekers.push(comment.message.body.split(' ')[0])
            }

            // cheering breakdown
            if(comment.message.body === '!cheer' && students.hasOwnProperty(comment.commenter.name)){
                if(!hasCheered.hasOwnProperty(comment.commenter.name)){
                    hasCheered[comment.commenter.name] = true;
                    ++houseUniqueCheer[students[comment.commenter.name]]
                }
                ++houseCheers[students[comment.commenter.name]]
            }

            // hangman winner breakdown
            if(comment.commenter.name === 'botfish5' && regexHangman.test(comment.message.body)){
                let hangmanWinner = comment.message.body.substr(14).split('!')[0]
                if(students.hasOwnProperty(hangmanWinner.toLowerCase()))
                    ++hangmanByHouse[students[hangmanWinner.toLowerCase()]]
            }

            if(comment.commenter.name === 'botfish5' && regexRandomNum.test(comment.message.body)){
                randomNumWinner[comment.message.body] = 0
            }

            // duel winnings
            if(comment.commenter.name === 'botfish5' && regexDuelWin.test(comment.message.body)){
                let winner = comment.message.body.split(' ')[0].toLowerCase();
                ++duelsWonByHouse[students[winner]]
            }

            // duels competed in
            if(comment.commenter.name === 'botfish5'
                && (regexDuelHasChallenged.test(comment.message.body) || regexDuelChosen.test(comment.message.body))){
                let duelAnnouncement = comment.message.body.replace('The Duelists have been chosen! ', '').replace('!!!', '').split(' ')
                let houseNumbers = []
                let i = 2;
                while(houseNumbers.length != 2){
                    if(duelAnnouncement[i] == "Gryffindor")
                        houseNumbers.push(0)
                    else if (duelAnnouncement[i] == "Hufflepuff")
                        houseNumbers.push(1)
                    else if(duelAnnouncement[i] == "Slytherin" || duelAnnouncement[i] == "Syltherin")
                        houseNumbers.push(2)
                    else if(duelAnnouncement[i] == "Ravenclaw")
                        houseNumbers.push(3)

                    ++i;
                }
                if(houseNumbers[0] !== houseNumbers[1]){
                    ++duelsParticipatedByHouse[houseNumbers[0]]
                    ++duelsParticipatedByHouse[houseNumbers[1]]
                }
            }

            if(comment.commenter.name === 'botfish5' && regexPayouts.test(comment.message.body)){
                let points = comment.message.body.replace('Payouts for Search Items |').split('|')
                points = points.map((house) => {
                    let temp = house.split(':')
                    return parseInt(temp[1])
                })
                for(let i = 0; i < 4; ++i)
                    totalHuntPoints[i] += points[i]
            }

            /* if(comment.commenter.name === 'joefish5' && (regexResults.test(comment.message.body) || regexPayouts.test(comment.message.body))){
                let regBrackets = RegExp(/\]\[/, 'g')
                let gamePoints = comment.message.body.replace('Final Results: [', '').replace('Quidditch Results: ', '').replace('Payouts for Search Items |', '').replace(regBrackets, '|').split('|')
                //console.log(gamePoints)
            } */

            if(comment.commenter.name === 'botfish5' && regexQuid.test(comment.message.body)){
                let points = comment.message.body.replace('Quidditch Results: ', '').split('|')
                points = points.map((house) => {
                    let temp = house.split(':')
                    return parseInt(temp[1])
                })

                for(let i = 0; i < 4; ++i)
                    totalQuidditchPoints[i] += points[i]
            }

            if(comment.commenter.name === 'botfish5' && regexDuel.test(comment.message.body)){
                let points = comment.message.body.replace('House payouts for the duel:', '').split('|')
                points = points.map((house) => {
                    let temp = house.split(':')
                    return parseInt(temp[1])
                })

                if(points[1] === 10 
                    && points[2] === -10 
                    && points[3] === 30) points[0] = 0

                for(let i = 0; i < 4; ++i){
                    if(points[i] == NaN) {
                        points[i] = 0
                    }
                    duelTotalPoints[i] += points[i]
                }
            }

            if(comment.commenter.name === 'botfish5' && regexStudents.test(comment.message.body)){
                let currentClass = comment.message.body.replace('Current Class Sizes', '').split('|').slice(1, 5)
                for(let i in currentClass){
                    currentClass[i] = currentClass[i].trim()
                    currentClass[i] = currentClass[i].split(' ')
                    currentClassSizes[i] = parseInt(currentClass[i][1])
                }
                //console.log(currentClassSizes)
            }

            if(regexWings.test(comment.message.body) || regexwings.test(comment.message.body)){
                if(students.hasOwnProperty(comment.commenter.name)){
                    ++wings[students[comment.commenter.name]]
                }
            }

            if(regexReggie.test(comment.message.body) || regexMonty.test(comment.message.body)){
                if(students.hasOwnProperty(comment.commenter.name))
                    ++pups[students[comment.commenter.name]]
            }
        })
    })

    allSeekers.forEach((seeker) => {
        if(students.hasOwnProperty(seeker.toLowerCase())){
            ++snitchesByHouse[students[seeker.toLowerCase()]]
        }
    })

    console.log(`Total Messages: ${chatMessageCount}`)
    console.log(`Non Commands: ${nonCommandMessages}`)
    console.log(`Total Cheers: ${houseCheers}`)
    console.log(`Unique Cheers: ${houseUniqueCheer}`)
    console.log(`Snitches: ${snitchesByHouse}`)
    console.log(`Total Quidditch Points: ${totalQuidditchPoints}`)
    console.log(`Hangman Wins: ${hangmanByHouse}`)
    console.log(`Duels Won: ${duelsWonByHouse}`)
    console.log(`Duel Points: ${duelTotalPoints}`)
    console.log(`Hunt Points: ${totalHuntPoints}`)
    console.log(`Said Pups: ${pups}`)
    /* console.log(`House Ordering: ${houses.houseNames}`)
    console.log(`Current Class sizes: ${houses.classSizesArray()}`)
    console.log()

    console.log(`Total Chat Messages: ${chatMessageCount}`)
    console.log()
    
    allSeekers.map((name) => {
        if(houses.isEnrolled(name)){
            ++snitchesByHouse[houses.students[name.toLowerCase()]]
        }
    })

    console.log(`Snitches Caught by house: ${snitchesByHouse}`)
    console.log()

    let snitchByName = {}
    allSeekers.map((seaker) => {
        if(houses.isEnrolled(seaker)){
            if(snitchByName.hasOwnProperty(seaker))
                ++snitchByName[seaker]
            else
                snitchByName[seaker] = 1
        }
    })

    let mostCaught = 0;
    let topSeakers = []
    Object.keys(snitchByName).map((seaker) => {
        if(snitchByName[seaker] > mostCaught){
            mostCaught = snitchByName[seaker]
            topSeakers = [seaker]
        }
        else if(snitchByName[seaker] == mostCaught)
            topSeakers.push(seaker)
    })
    console.log(`Most Snitches Caught By One Person: ${mostCaught}`)
    console.log(`People that caught the most Snitches: ${topSeakers}`)
    console.log()

    console.log(`Total Quidditch Points ${totalQuidditchPoints}`)
    console.log()

    console.log(`Most Cheering by House: ${houseCheers}`)
    console.log(`Unique Cheers by House: ${houseUniqueCheer}`)
    console.log()

    ++hangmanByHouse[houses.students['maverick825']]
    console.log(`Hangman wins by house: ${hangmanByHouse}`)
    console.log()

    console.log(`Duels Participated in by House: ${duelsParticipatedByHouse}`)
    console.log()

    console.log(`Duels won by house ${duelsWonByHouse}`)
    console.log()

    let randomNumWinners = Object.keys(randomNumWinner).map(x => x.split(' ')[0])
    for(let winner of randomNumWinners)
        if(houses.isEnrolled(winner))
            ++randomNumWinnerByHouse[houses.students[winner.toLowerCase()]]

    console.log(`Random number winners by house: ${randomNumWinnerByHouse}`)
    console.log()

    console.log(`Hunt point totals: ${totalHuntPoints}`)
    console.log()

    console.log(`Total duel points: ${duelTotalPoints}15`) */
}

/* let chatMessageCount = [0, 0, 0, 0]

let botMessage = (msg) => {
    return msg.commenter.name === 'botfish5'
}

let runFiles = () => {
    let messageCount = {}
    files.forEach(file => {
        fs.readFile(`./logs/hp/thabuttress/${file}`, (err, data) => {
            const { comments } = JSON.parse(data)
    
            let botMessageCount = 0
            comments.forEach(msg => {
                if(botMessage(msg)) {
                    ++botMessageCount
                }
                else{
                    if(students.hasOwnProperty(msg.commenter.name)){
                        console.log(students[msg.commenter.name])
                        ++chatMessageCount[students[msg.commenter.name]]
                    }
                }
            })
            console.log(`File Name: ${file} Bot Message Count: ${botMessageCount}`)
        })
        console.log(chatMessageCount)
    })
}

runFiles() */

//chatStats(allLogs)