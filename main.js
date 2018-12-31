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
clickBtnBind(randomStopBtn)

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
const startDuelBtn = document.getElementById("startDuelBtn")
clickBtnBindChannel(startDuelBtn)

const pickDuelBtn = document.getElementById("pickDuelBtn")
clickBtnBind(pickDuelBtn)

const duelBtn = document.getElementById("duelBtn")
clickBtnBind(duelBtn)

const resetDuelBtn = document.getElementById("resetDuelBtn")
clickBtnBind(resetDuelBtn)

const testDuelBtn = document.getElementById("testDuelBtn")
clickBtnBindChannel(testDuelBtn)

const testDuelBetsBtn = document.getElementById("testDuelBetsBtn")
clickBtnBind(testDuelBetsBtn)

// giveaway controls
const giveStartBtn = document.getElementById("giveawayStartBtn")
clickBtnBindChannel(giveStartBtn)

const giveStopBtn = document.getElementById("giveawayStopBtn")
clickBtnBind(giveStopBtn)

const giveDrawBtn = document.getElementById("giveawayDrawBtn")
clickBtnBind(giveDrawBtn)

const giveClearBtn = document.getElementById("giveawayClearBtn")
clickBtnBind(giveClearBtn)