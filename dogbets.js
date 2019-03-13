let houses = require('./Houses')
let fs = require("fs")

let currentBets = JSON.parse(fs.readFileSync('dogbets.json'))

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
                
                if(currentBets.hasOwnProperty(name)){
                    if(currentBets[name].hasOwnProperty(dog)){
                        if(currentBets[name][dog].hasOwnProperty(breed)){
                            currentBets[name][dog][breed] += amount
                        }else
                            currentBets[name][dog][breed] = amount
                    }
                    else
                        currentBets.name[dog] = {}
                        currentBets.name.dog[breed] = amount
                }
                else{
                    currentBets[name] = {}
                    currentBets[name][dog] = {}
                    currentBets[name][dog][breed] = amount
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
                result += ` ${dog.toUpperCase()}:`
                let breeds = Object.keys(currentBets[name][dog])
                for(let breed of breeds)
                    result += ` ${breed}: ${currentBets[name][dog][breed]} |`
            }
            return result
        }
        return false
    }
}