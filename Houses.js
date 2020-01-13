const co = require('co')
const fetch = require('node-fetch')
const fs = require('fs')
const mongoose = require('mongoose')
const studentModel = require('./models/student')
const dotenv = require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.MONGO_NAME}:${process.env.MONGO_PASS}@cluster0-sxqxp.mongodb.net/test?retryWrites=true&w=majority`, {
  useNewUrlParser:true,
  useUnifiedTopology: true
}).catch(err => {console.log(err)})

let displayNames = JSON.parse(fs.readFileSync('displayNames.json'))

let students = {}
studentModel.find({}).then(res => {
  res.forEach(student => {
    const { name, houseNum} = student
    students[name] = houseNum
  })
}).catch(err => {console.log(err)})

.catch(err => {console.log(err)})
module.exports = {
  houseNames: ["Gryffindor", "Hufflepuff", "Slytherin", "Ravenclaw"],
  students,
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
  },
  addNewStudent:(name, houseNum) => {
    const student = new studentModel({
      name, 
      houseNum
    }).save().then(res => {
      students[name] = houseNum
      return true
    }).catch(err => {
      console.log(err)
      return false
    })
  }
}