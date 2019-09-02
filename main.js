const dropDown = document.getElementById("channelsDropDown");

(async () => {
  let response = await fetch(window.location + "channels")
  let json = await response.json();
  json.forEach(element => {
    let op = document.createElement("option")
    op.innerText = element.replace("#", "")
    op.value = element.replace("#", "")
    dropDown.appendChild(op)
  });
})();

// generalized functions for buttons 
function clickBtnBind(buttonObject){
  buttonObject.addEventListener('click', stardardAPI);
}

async function stardardAPI(){
  let response = await fetch(window.location + this.value);
  let json = await response.json();
  console.log(json);
}

// use this one for passing a single value
async function stardardAPICall(string){
  let response = await fetch(window.location + string);
  let json = await response.json();
  console.log(json);
}

function clickBtnBindChannel(buttonObject){
  buttonObject.addEventListener('click', stardardAPICallChannel);
}

async function stardardAPICallChannel(){
  let response = await fetch(window.location + this.value + dropDown.value);
  let json = await response.json();
  console.log(json);
}

// channel options
const testBtn = document.getElementById("testBtn")
clickBtnBindChannel(testBtn)

const houseUpdateBtn = document.getElementById("houseUpdateBtn")
clickBtnBind(houseUpdateBtn)

const clearAllBtn = document.getElementById("clearAllBtn")
clearAllBtn.addEventListener('click', clearAllGames)

function clearAllGames(){
  clearAll();
  stardardAPICall(clearAllBtn.value);
}

// handman options
const hangmanInput = document.getElementById("hangmanInput");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const clearBtn = document.getElementById("clearBtn");
const wordP = document.getElementById("wordDisplay");

startBtn.addEventListener('click', startHangman)

function changeDisplay(input){
  wordP.innerHTML = input
}

hangmanInput.addEventListener('keypress', e => { 
  if(e.keyCode === 13 || e.which === 13)
    startHangman() 
})

async function startHangman() {
  changeDisplay(hangmanInput.value)
  if(hangmanInput.value.length > 0){
    let hangman = hangmanInput.value.trim().toUpperCase()
    wordP.innerHTML = hangman;
    
    let data = JSON.stringify({
      "hangman": hangman,
      "channel": dropDown.value
    })
    
    let response = await fetch(window.location + "hangman",{
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: data
    })
    let json = await response.json()
    console.log(`Start Hangman: ${json}`);
  }
}

pauseBtn.addEventListener('click', pauseToggle)
async function pauseToggle(){
  let response = await fetch(window.location + "hangman/pause")
  let json = await response.json()
  console.log(json);
  (json) ? pauseBtn.innerHTML = "UNPAUSE" 
    : pauseBtn.innerHTML = "PAUSE"
}

clearBtn.addEventListener('click', clearAll)
function clearAll(){
  hangmanInput.value = "";
  wordP.innerText = "";
  randNumInput.value = "";
  stardardAPICall(clearBtn.value)
}

// random number
let randNumInput = document.getElementById("randomNumInput")
const randomStartBtn = document.getElementById("randomStartBtn")

randomStartBtn.addEventListener('click', startRandNum)
async function startRandNum(){
  stardardAPICall(randomStartBtn.value + randNumInput.value + "+" + dropDown.value)
}

const randomStopBtn = document.getElementById("randomStopBtn")
clickBtnBindChannel(randomStopBtn)

// quidditch controls
const quidditchStartBtn = document.getElementById("quidditchStartBtn")
clickBtnBindChannel(quidditchStartBtn)

const quidditchStopBtn = document.getElementById("quidditchStopBtn")
clickBtnBind(quidditchStopBtn)

const quidditchPayoutsBtn = document.getElementById("quidditchPayoutsBtn")
clickBtnBind(quidditchPayoutsBtn)

const quidditchClearBtn = document.getElementById("quidditchClearBtn")
clickBtnBind(quidditchClearBtn)

const quidditchResultsBtn = document.getElementById("quidditchResultsBtn")
clickBtnBind(quidditchResultsBtn)

// duel controls
// special select duelists
let allStudents;
const specialDuelBtn = document.getElementById("specialDuelBtn")
const studentsWizDuel1 = document.getElementById("studentsWizDuel1")
const studentsWizDuel2 = document.getElementById("studentsWizDuel2")

specialDuelBtn.addEventListener('click', postSpecialDuel)

let getStudents = async() => {
  let response = await fetch(window.location + 'students')
  allStudents = await response.json()
  updateStudentSelector(searchSelect, allStudents)
  updateStudentSelector(studentsWizDuel1, allStudents)
  updateStudentSelector(studentsWizDuel2, allStudents)
}

let updateStudentSelector = (selectItem, students) =>{
  let names = Object.keys(students).sort()
  let sortedStudents = [[], [], [], []]
  const houses = ["Gryffindor", "Hufflepuff", "Slytherin", "Ravenclaw"]
  names.map((name) => {
    sortedStudents[students[name]].push(name)
  })
  let newOption;

  for(let i in sortedStudents){
    newOption = document.createElement('option')
    newOption.innerText = houses[i].toUpperCase()
    newOption.disabled = true;
    selectItem.appendChild(newOption)

    sortedStudents[i].map((name) => {
      newOption = document.createElement('option')
      newOption.value = name
      newOption.innerText = `${houses[i][0]}: ${name}`
      selectItem.appendChild(newOption)
    })
  }
}
getStudents();

async function postSpecialDuel()  {
  let data = JSON.stringify({
    "channel":dropDown.value,
    "student1":inputWizDuelSearch1.value,
    "student2":inputWizDuelSearch2.value
  })

  let response = await fetch(window.location + 'duel/game/specialDuel', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: data
  })

  let json = await response.json()
  console.log(json)
}

// standard duel random selector
const startDuelBtn = document.getElementById("startDuelBtn")
clickBtnBindChannel(startDuelBtn)

const pickDuelBtn = document.getElementById("pickDuelBtn")
clickBtnBind(pickDuelBtn)

const duelBtn = document.getElementById("duelBtn")
clickBtnBind(duelBtn)

const resetDuelBtn = document.getElementById("resetDuelBtn")
clickBtnBind(resetDuelBtn)

// backup bot buttons
const backupBotBtn = document.getElementById("backupBotBtn")
backupBotBtn.addEventListener('click', backupBtnToggle)

async function backupBtnToggle(){
  let response = await fetch(window.location + backupBotBtn.value)
  let json = await response.json()
  botStatus(json)
}

(async () => {
  let response = await fetch(window.location + 'backupBot')
  let json = await response.json()
  botStatus(json)
})();

function botStatus(status){
  (status)? backupBotBtn.innerHTML = backupBotBtn.innerHTML.replace('On', 'Off'):
  backupBotBtn.innerHTML = backupBotBtn.innerHTML.replace('Off', 'On');
}

// search controls
const itemHuntInput = document.getElementById("itemHuntInput")
const startSearchBtn = document.getElementById("startSearchBtn")
startSearchBtn.addEventListener("click", startSearchGame)

async function startSearchGame() {
  let data = JSON.stringify({
    student:itemHuntInput.value,
    channel:dropDown.value
  })

  let response = await fetch(window.location + 'search',{
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: data
  })

  let json = await response.json();
  console.log(json)
}

const continueSearchBtn = document.getElementById("continueSearchBtn")
clickBtnBind(continueSearchBtn)

const clearSearchBtn = document.getElementById("clearSearchBtn")
clickBtnBind(clearSearchBtn)

// giveaway controls
const giveStartBtn = document.getElementById("giveawayStartBtn")
clickBtnBindChannel(giveStartBtn)

const giveStopBtn = document.getElementById("giveawayStopBtn")
clickBtnBindChannel(giveStopBtn)

const giveDrawBtn = document.getElementById("giveawayDrawBtn")
clickBtnBind(giveDrawBtn)

const giveClearBtn = document.getElementById("giveawayClearBtn")
clickBtnBind(giveClearBtn)

// puptime controls
const puptimeStartBtn = document.getElementById('puptimeStartBtn')
clickBtnBindChannel(puptimeStartBtn)

const puptimeStopBtn = document.getElementById('puptimeStopBtn')
clickBtnBindChannel(puptimeStopBtn)

const puptimeClearBtn = document.getElementById('puptimeClearBtn')
clickBtnBindChannel(puptimeClearBtn)

// trivia controls and setup
const triviaDropDown = document.getElementById("triviaDropDown");

(async () => {
  let response = await fetch("https://opentdb.com/api_category.php")
  let json = await response.json();
  json.trivia_categories.forEach(element => {
    let op = document.createElement("option")
    op.innerText = element.name
    op.value = element.id
    triviaDropDown.appendChild(op)
  });
})();

const triviaStartBtn = document.getElementById('triviaStartBtn')
async function startTrivia(){
  let data = JSON.stringify({
    channel:dropDown.value,
    category:triviaDropDown.value,
    amount:5
  })
  let response = await fetch(window.location + 'trivia',{
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: data
  })
  let json = await response.json()
  console.log(json)
}
triviaStartBtn.addEventListener('click', startTrivia)

const triviaNextBtn = document.getElementById('triviaNextBtn')
clickBtnBindChannel(triviaNextBtn)

const triviaStopBtn = document.getElementById('triviaStopBtn')
clickBtnBindChannel(triviaStopBtn)

const triviaResetBtn = document.getElementById('triviaResetBtn')
clickBtnBindChannel(triviaResetBtn)

// edit display values
const streamDisplay = document.getElementById('streamDisplay')
const streamDisplayInput = document.getElementById('streamDisplayInput')
const streamDisplayInputFontSize = document.getElementById('streamDisplayInputFontSize')
const streamDisplayColor = document.getElementById('streamDisplayColor')
const streamDisplayColorList = document.getElementById('streamDisplayColorList')
const streamDisplaySubmit = document.getElementById('streamDisplaySubmit')
const streamDisplayClear = document.getElementById('streamDisplayClear')

const CSS_COLOR_NAMES = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","DarkOrange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","RebeccaPurple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
CSS_COLOR_NAMES.forEach((color) => {
  let option = document.createElement("option")
  option.value = color;
  option.innerText = color;
  streamDisplayColorList.appendChild(option)
})

postStreamDisplay = async (val, font, color) => {
  const pass = dropDown.value;
  const body = JSON.stringify({
    value:val,
    font:font,
    color
  })
  const actual = `https://buttress-live-display.herokuapp.com?password=${pass}`
  let res = await fetch(actual, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  })
  let json = res.json()
  return json
}

let displayCall = async () => {
  let result = await postStreamDisplay(
    streamDisplayInput.value, 
    parseInt(streamDisplayInputFontSize.value), 
    streamDisplayColor.value)
  if(result.value)
    streamDisplay.innerText = `${result.value} | Font: ${result.font} | Color: ${result.color}`
}

const streamDisplayInputs = document.getElementsByClassName('input is-small streamDisplay')
for (let input of streamDisplayInputs){
  input.addEventListener('keypress', async (e) => {
    const key = e.which || e.keyCode;
    if(key === 13){
      displayCall();
    }
  })
}

streamDisplaySubmit.addEventListener('click', async () => {
  displayCall();
})

streamDisplayClear.addEventListener('click', async () => {
  let result = await postStreamDisplay('', 0, 'white')
  streamDisplayInput.value = ''
  streamDisplay.innerText = ''
})

// wordban increase and decrease
const wordBanNumberInput = document.getElementById('wordBanNumberInput')
const wordBanIncrease = document.getElementById('wordBanIncrease')
const wordBanDecrease = document.getElementById('wordBanDecrease')

clickBtnBindChannel(wordBanIncrease)
clickBtnBindChannel(wordBanDecrease)