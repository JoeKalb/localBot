const houses = require('./Houses')
const fs = require('fs')

let chatMessageCount = [0, 0, 0, 0]

let snitchesByHouse = [0, 0, 0, 0]

let hasCheered = {}
let houseCheers = [0, 0, 0, 0]
let houseUniqueCheer = [0, 0, 0, 0]

let hangmanByHouse = [0, 0, 0, 0]

let duelsParticipatedByHouse = [0, 0, 0, 0]
let duelsWonByHouse = [0, 0, 0, 0]

let randomNumWinner = {}
let randomNumWinnerByHouse = [0, 0, 0, 0]

const path = 'logs/buttressChatLogs'

let allLogs;

fs.readdir(path, (err, files) => {
    if(err)
        console.log(err)
    else{
        allLogs = files
        chatStats(allLogs)
    }
})

let notBotResponse = (message) => {
    if(message[0] === '!'){
        return false;
    }

    let regexResponses = [
        RegExp('The winner is ', 'g'),
        RegExp('appears', 'g'),
        RegExp('100 points to ', 'g'),
        RegExp(' wins! The correct number was ', 'g'),
        RegExp(' entered the Dueling Club', 'g'),
        RegExp('Join our offline Discord chat! Subs: Link your discord to your twitch account for bonus channels! https://discord.gg/rWnczNe', 'g'),
        RegExp(`buttHouse If you want to join in on the Harry Potter fun go the the pottermore website http://bit.ly/2ETyXDB and post a screenshot your house in the #sorting_hat channel of the discord! https://discord.gg/j3G5bx3 buttHouse`, 'g'),
        RegExp(`Butt's built this 6020 piece Hogwarts Lego Set! https://amzn.to/2LEy7uE buttHouse https://clips.twitch.tv/AltruisticBreakableToadDuDudu`, 'g'),
        RegExp("You're all such nerds!!!", 'g'),
        RegExp(`If you're planning on buying a kit check out https://www.gundamplanet.com/ and use coupon code "THABUTTRESS" to get 10% off all regularly priced items!`, 'g'),
        RegExp(`Look at all these cool items that thaButtress has built and customized! https://thabuttress.imgur.com/ buttOMG`, 'g'),
        RegExp(`Check out Butt's built list and backlog!!! https://goo.gl/7DxzVX buttDab`, 'g'),
        RegExp(`Digging the current playlist? https://www.twitch.tv/relaxbeats`, 'g'),
        RegExp(`Here are all of butt's tattoos! https://imgur.com/a/Vd1iAMF`, 'g'),
        RegExp(`IF YOU ARE A SUB...Subnights will be held every other Thursday!!! We'll be watching all the Fantastic Beasts movies at around 7pm so make sure to join the !discord and link it with your twitch account!!! buttHouse`, 'g'),
        RegExp(`Ways to earn points for your house: Donations - $1=5pts Bits - 100=5pts Gifted Subs - 1=25pts Community Games buttHouse`, 'g'),
        RegExp(`Butt's currently building the Hexa Gear Rayblade Impulse buttOMG https://amzn.to/2M3RYnr`, 'g'),
        RegExp(`Butt's twitter: https://twitter.com/thaButtress`, 'g'),
        RegExp(`Twitter: https://twitter.com/thaButtress | Insta: https://instagram.com/thabuttress/ | YouTube: https://goo.gl/uIL66O | SnapChat: @thabuttress`, 'g'),
        RegExp(`Butt's Instagram: https://instagram.com/thabuttress/`, 'g'),
        RegExp(`Buttress (noun) - a projecting support of stone or brick built against a wall`, 'g'),
        RegExp(`You can follow @thabuttress on snapchat but she only does add backs for T2 subs and above.`, 'g'),
        RegExp(`Check out these Gundam Planet lotto winners! https://www.twitch.tv/videos/362520541`, 'g'),
        RegExp(`buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad buttDad`, 'g'),
        RegExp(`Instagram https://goo.gl/Jf4v7U | Twitter https://goo.gl/y3gpVu | FaceBook https://goo.gl/kqIjiz | Patreon https://goo.gl/iDRnBW | Snapchat: thaButtress`, 'g'),
        RegExp(`A donation of $10 gets your name into the Goblet of Fire! Each entry will be a ticket into a giveaway for the custom ButtCoin plus a lil extra something for the !top single donation! buttHouse`, 'g'),
        RegExp(`The largest single donation by the 27th will get the chance to pick Butt's next Gundam + 500 points towards their house!`, 'g'),
        RegExp(`Could not find broadcaster: `, 'g'),
        RegExp(`buttHype Yo yo the homie `, 'g'),
        RegExp('Recorded: ', 'g'),
        RegExp(' has challenged ', 'g'),
        RegExp('This duel is forbidden!!!', 'g'),
        RegExp(`, you don't have a !house yet.`, 'g'),
        RegExp(` is in the Dueling Club!`, 'g'),
        RegExp('Welcome to the dueling club ', 'g'),
        RegExp('The Duelists have been chosen!', 'g'),
        RegExp(`There weren't enough entries to start the duel. Reopening the club!`, 'g'),
        RegExp(`, need to do !bet 1 or !bet 2`, 'g'),
        RegExp(`won the duel against`, 'g'),
        RegExp(` points to `, 'g'),
        RegExp(`'s points buttThump`, 'g'),
        RegExp(`. There's no one to !bet on yet.`, 'g'),
        //RegExp('!bet 1 \[', 'g'),
        RegExp(`This Duelists haven't been selected yet!`, 'g'),
        RegExp(`The Duelists haven't been selected yet!, 'g`),
        RegExp(`Number of students by house in the Dueling Club:`, 'g'),
        RegExp(`The bets are in and the duel is about to begin!`, 'g'),
        RegExp(`House payouts for the duel:`, 'g'),
        RegExp(` casts `, 'g'),
        RegExp(` won the duel! `, 'g'),
        RegExp(` were equaly matched. They had a good duel though so they split the winnings!`, 'g'),
        RegExp(` dorm to search for the`, 'g'),
        RegExp(`Cannot find student: `, 'g'),
        RegExp(`Payouts for Search Items`, 'g'),
        RegExp(`Search Payout for `, 'g'),
        RegExp(` wandering the halls!`, 'g'),
        //RegExp('! \[', 'g'),
        RegExp(` go when they leave the dorm? !left or !right`, 'g'),
        RegExp(` take? !left or !right`, 'g'),
        RegExp(` open? !left or !right`, 'g'),
        RegExp(` walks out of the dorm and turns `, 'g'),
        RegExp(`At the end of the hall there are two moving staircases.`, 'g'),
        RegExp('runs directly into Filtch', 'g'),
        RegExp(` heads down the `, 'g'),
        RegExp(`At the bottom of the staircase there are two doors.`, 'g'),
        RegExp(` sees a black cat sitting on the bottom of the staircase. The cat transforms into Professor McGonagall, "Howgarts students are not permitted to leave the dorms at night!" `, 'g'),
        RegExp(` slowly turns the knob of the door on the `, 'g'),
        RegExp(` opens the door, and looks directly at Professor Snape, "Roaming the halls at this hour and someone will think you're up to something..."`, 'g'),
        RegExp(` comes face to face with a mirror, and then feel a small bump in their pocket.`, 'g'),
        RegExp(`Behind the door is a dark staircase, `, 'g'),
        RegExp(` walks into the giant room. If seems like its raining but liquid is sweet with its source bursting from the center of the room.`, 'g'),
        RegExp(`A giant stone chalice sits in the middle of the room with a huge blue flame coming out of it.`, 'g'),
        RegExp(` really had to go to the bathroom, and finds the fanciests chamberpots in the entire school!`, 'g'),
        RegExp(`Floating in the middle of the room is a thin book that guarantees a perfect score on the tests next week!`, 'g'),
        RegExp(`Want to play some Quidditch! Do !play to join the game!!!`, 'g'),
        RegExp(` caught the Golden Snitch and ended the game!`, 'g'),
        RegExp(`Quidditch Results: `, 'g'),
        RegExp(` threw the Quaffle and `, 'g'),
        RegExp(` caught the snitch!`, 'g'),
        RegExp(` scored `, 'g'),
        RegExp(`! Too bad they don't have a house yet buttThump`, 'g'),
        RegExp(`Students in `, 'g'),
        RegExp(`is in`, 'g'),
        RegExp(` has no !house yet!`, 'g'),
        RegExp(`Current Class Sizes`, 'g'),
        RegExp(`Students in `, 'g'),
        RegExp(`GO GO `, 'g'),
        RegExp(`HOT STUFF `, 'g'),
        RegExp(`WIN WIN `, 'g'),
        RegExp(`RA RA `, 'g'),
        RegExp(`, you need a !house to cheer.`, 'g'),
        RegExp(`RAID buttBest buttCrew`, 'g'),
        RegExp(`MUGGLE RAID!!!`, 'g'),
        RegExp(`During an item hunt you get the chance to choose !left or !right as you navigates Hogwarts while the other students in the chat also get to guess on which direction is corrent. But be careful! If you run into a professor you'll loose house points but making it all the way through and win 200!!! buttHouse Main student losses: [10, 20, 50] | Other students win/loss: [10, 15, 20]`, 'g'),
        RegExp(`Current list of all Harry Potter commands: `, 'g'),
        RegExp(`Students in `, 'g'),
        RegExp(` time!`, 'g'),
        RegExp(` times!`, 'g'),
        RegExp(`-`, 'g'),
        RegExp(`Guess a number betweet`, 'g'),
        RegExp(`Guess a number between`, 'g'),
        RegExp(`It's time for some hangman!`, 'g'),
        RegExp(`Want to join the duel club?`, 'g'),
        RegExp(/\|/, 'g')
    ]

    for(let botMessage of regexResponses){
        if(botMessage.test(message)){
            //console.log(`RegEx: ${botMessage} Message Removed: ${message}`)
            return false;
        }
    }
    //console.log(message)
    return true;
}

let chatStats = (files) => {
    let comments;
    let allSeekers = []

    let regexSnitch = RegExp('caught the Golden Snitch', 'g');
    let regexHangman = RegExp('The winner is ', 'g');
    let regexDuelWin = RegExp(' won the duel! ', 'g')
    let regexDuelHasChallenged = RegExp(' has challenged ', 'g')
    let regexDuelChosen = RegExp('The Duelists have been chosen!', 'g')
    let regexRandomNum = RegExp('wins! The correct number was', 'g')

    files.map((file) => {
        comments = JSON.parse(fs.readFileSync(`${path}/${file}`)).comments
        comments.map((comment) => {
            // most chat messages
            if(houses.isEnrolled(comment.commenter.name)){
                if(comment.commenter.name == 'joefish5'){
                    if(!comment.message.is_action && notBotResponse(comment.message.body))
                        ++chatMessageCount[0]
                }
                else
                    if(comment.message.body[0] !== '!')
                        ++chatMessageCount[houses.students[comment.commenter.name]]
            }
            
            // quidditch snitch breakdown
            if(comment.commenter.name == 'joefish5' && regexSnitch.test(comment.message.body)){
                allSeekers.push(comment.message.body.split(' ')[0])
            }

            // cheering breakdown
            if(comment.message.body === '!cheer' && houses.isEnrolled(comment.commenter.name)){
                if(!hasCheered.hasOwnProperty(comment.commenter.name)){
                    hasCheered[comment.commenter.name] = true;
                    ++houseUniqueCheer[houses.students[comment.commenter.name]]
                }
                ++houseCheers[houses.students[comment.commenter.name]]
            }

            // hangman winner breakdown
            if(comment.commenter.name === 'joefish5' && regexHangman.test(comment.message.body)){
                let hangmanWinner = comment.message.body.substr(14).split('!')[0]
                if(houses.isEnrolled(hangmanWinner))
                    ++hangmanByHouse[houses.students[hangmanWinner.toLowerCase()]]
            }

            if(comment.commenter.name === 'joefish5' && regexRandomNum.test(comment.message.body)){
                randomNumWinner[comment.message.body] = 0
            }

            // duel winnings
            if(comment.commenter.name === 'joefish5' && regexDuelWin.test(comment.message.body)){
                let winner = comment.message.body.split(' ')[0].toLowerCase();
                ++duelsWonByHouse[houses.students[winner]]
            }

            // duels competed in
            if(comment.commenter.name === 'joefish5'
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
        })
    })

    console.log(`Current Class sizes`)
    console.log(houses.classSizesArray())

    console.log("Total Chat Messages")
    console.log(chatMessageCount)
    
    allSeekers.map((name) => {
        if(houses.isEnrolled(name)){
            ++snitchesByHouse[houses.students[name.toLowerCase()]]
        }
    })

    console.log("Snitches Caught by house")
    console.log(snitchesByHouse)

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
    console.log(`Most Snitches Caught: ${mostCaught}`)
    console.log(topSeakers)

    console.log(`Most Cheering by House`)
    console.log(houseCheers)
    console.log(`Unique Cheers`)
    console.log(houseUniqueCheer)

    ++hangmanByHouse[houses.students['maverick825']]
    console.log(`Hangman wins by house`)
    console.log(hangmanByHouse)

    console.log(`Duels Participated in by House`)
    console.log(duelsParticipatedByHouse)

    console.log(`Duels won by house`)
    console.log(duelsWonByHouse)

    let randomNumWinners = Object.keys(randomNumWinner).map(x => x.split(' ')[0])
    for(let winner of randomNumWinners)
        if(houses.isEnrolled(winner))
            ++randomNumWinnerByHouse[houses.students[winner.toLowerCase()]]

    console.log(`Random number winners by house`)
    console.log(randomNumWinnerByHouse)
}
module.exports = {
    getChatMessageCount: () => {
        return chatMessageCount
    },
    getSnitchesByHouse: () => {
        return snitchesByHouse
    },
    getHouseCheers: () => {
        return houseCheers
    },
    getHouseUniqueCheer: () => {
        return houseUniqueCheer
    },
    getHangmanByHouse: () => {
        return hangmanByHouse
    },
    getDuelsParticipatedByHouse: () => {
        return duelsParticipatedByHouse
    },
    getDuelsWonByHouse: () => {
        return duelsWonByHouse
    },
    getRandomNumWinnerByHouse: () =>{
        return randomNumWinnerByHouse
    }
}