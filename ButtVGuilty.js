let houses = new require('./Houses')

module.exports = {
    channel:"",
    students: {},
    allowBets: false,
    playerCount:0,
    bidAmount:10,
    studentCount:0,
    studentHouseCount:[0,0,0,0],
    finalPayouts:[0,0,0,0],
    betsPlaced:[0,0,0],
    winnerFound:false,
    start: function(newChannel){
        if(this.winnerFound)
            this.clear()
        this.channel = newChannel
        this.allowBets = true
    },
    bet: function(studentName, betOn){
        if(this.allowBets 
            && !this.students[studentName] 
            && houses.students.hasOwnProperty(studentName)){
                let studentHouseNum = houses.students[studentName]
                this.students[studentName] = betOn
                this.betsPlaced[betOn] += this.bidAmount
                ++this.studentHouseCount[studentHouseNum]
                ++this.studentCount
                console.log(`${studentName}: ${betOn}`)
        }
    },
    getBets: function(){
        return `Bets for Butt: ${this.betsPlaced[0]/10} Bets for Guilty: ${this.betsPlaced[1]/10}`
    },
    selectWinnerAndPayout: function(winner){
        this.allowBets = false
        this.betsPlaced[2] = winner
        this.winnerFound = true
        let names = Object.keys(this.students)
        for(let i = 0; i < names.length; ++i){
            let studentHouseNum = houses.students[names[i]]
            if(this.students[names[i]] === winner){
                this.finalPayouts[studentHouseNum] += 10
            }
            else{
                this.finalPayouts[studentHouseNum] -= 10
            }
        }

        return `The winner is ${(winner === 0)? 'thaButtress':'GuiltyCosplay'}!`
    },
    houseResults: function(){
        let result = "House payouts:"
        for(let i=0; i < 4; ++i)
            result += ` ${houses.houseNames[i]}: ${this.finalPayouts[i]} |`

        return result
    },
    clear: function(){
        this.channel = ""
        this.students =  {}
        this.allowBets =  false
        this.playerCount = 0
        this.studentCount = 0
        this.studentHouseCount = [0,0,0,0]
        this.finalPayouts = [0,0,0,0]
        this.betsPlaced = [0,0,0]
        this.winnerFound = false
    }
}