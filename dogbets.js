let houses = require('./Houses')
let fs = require("fs")

let currentBets = JSON.parse(fs.readFileSync('dogbets.json'))

let finalPayouts = {
    joefish5:68,
    grantypants:6874,
    donutscurecancer:1232,
    patrioticgrizzly:8965,
    thabuttress:35,
    henrynighthawk:89,
    vidgrod4567:179,
    aofool:1793
}

module.exports = {
    placeBet: (msg) => {
        const parse = msg.split(' ')
        if(/monty/i.test(parse[2]) || /reggie/i.test(parse[2])){
            fs.appendFile("logs/DogBets.txt", `${msg}\n`, (err) => {
                if(err) throw err;
                console.log(`Message saved: ${msg}`)
            })
            try{
                //console.log(currentBets)
                let name = parse[0].toLowerCase()
                let dog = parse[2].toLowerCase()
                let breed = parse[5].toLowerCase().replace(':', '')
                let amount = parseInt(parse[6])
                let added = false
                
                if(currentBets.hasOwnProperty(name)){
                    if(currentBets[name].hasOwnProperty(dog)){
                        if(currentBets[name][dog].hasOwnProperty(breed)){
                            currentBets[name][dog][breed] += amount
                            added = true;
                        }else
                            if(!added){
                                console.log(`New Breed for ${name} in ${dog}: ${breed}`)
                                let originalBreeds = currentBets[name][dog]
                                originalBreeds[breed] = amount
                                currentBets[name][dog] = originalBreeds
                                console.log(currentBets[name][dog])
                                added = true
                            }
                    }
                    else
                        if(!added){
                            console.log(`New Dog for ${name}: ${dog}`)
                            currentBets[name][dog] = {}
                            currentBets[name][dog][breed] = amount
                            added = true;
                        }
                }
                else{
                    if(!added){
                        console.log(`New Entry: ${name}`)
                        currentBets[name] = {}
                        currentBets[name][dog] = {}
                        currentBets[name][dog][breed] = amount
                        added = true;
                    }

                }
                currentBets.amount += amount
                if(/monty/i.test(dog))
                    currentBets.montyAmount += amount
                else
                    currentBets.reggieAmount += amount

                fs.writeFileSync('dogbets.json', JSON.stringify(currentBets))
                console.log(`Bet added: ${dog} | ${name} | ${amount}`)
            }
            catch(err){
                console.log(`Error in dogbets: ${err}\nmsg: ${msg}`)
            }
        }
    },
    showBets: (name) => {
        if(currentBets.hasOwnProperty(name)){
            let dogs = Object.keys(currentBets[name])
            let disName = houses.getDisplayName(name)
            let result = `${disName} -`
            for(let dog of dogs){
                result += ` ${dog} :`
                let breeds = Object.keys(currentBets[name][dog])
                for(let breed of breeds)
                    result += ` ${breed}: ${currentBets[name][dog][breed]} |`
            }
            return result.replace('monty', 'buttMonty').replace('reggie', 'buttReggie')
        }
        return false
    },
    winnings:(name) => {
        if(currentBets.hasOwnProperty(name)){
            let dogs = Object.keys(currentBets[name])
            let totalBets = 0;
            for(dog of dogs){
                let guesses = Object.keys(currentBets[name][dog])
                for(guess of guesses){
                    totalBets += currentBets[name][dog][guess]
                }
            }

            return (finalPayouts.hasOwnProperty(name)) ?
                `${houses.getDisplayName(name)} bet ${totalBets} buttcoins and won ${finalPayouts[name]}! buttOMG`:
                `${houses.getDisplayName(name)} lost ${totalBets} buttcoins buttThump`
        }
        return `You didn't place any bets ${houses.getDisplayName(name)}`;
    },
    payouts:() => {
        return finalPayouts;
    }
}