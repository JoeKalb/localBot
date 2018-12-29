let hangmanInput = document.getElementById("hangmanInput");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const clearBtn = document.getElementById("clearBtn");
const testBtn = document.getElementById("testBtn");
const dropDown = document.getElementById("channelsDropDown");
const wordP = document.getElementById("wordDisplay");

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

testBtn.addEventListener('click', test);

async function test() {
  let uri = window.location + "testBtn/" + dropDown.value
  let response = await fetch(uri)
  let json = await response.json()
  console.log(json)
}

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
  clearBackend();
}
async function clearBackend(){
  let response = await fetch(window.location + "hangman/clear")
  let json = await response.json();
  console.log(json);
}

const giveStartBtn = document.getElementById("giveawayStartBtn")
const giveStopBtn = document.getElementById("giveawayStopBtn")
const giveDrawBtn = document.getElementById("giveawayDrawBtn")
const giveClearBtn = document.getElementById("giveawayClearBtn")

giveStartBtn.addEventListener('click', startGiveaway)

async function startGiveaway() {
  let response = await fetch(window.location + "giveaway/" + dropDown.value)
  let json = await response.json();
  console.log(json)
}

giveStopBtn.addEventListener('click', stopEntries)

async function stopEntries(){
  let response = await fetch(window.location + "giveaway/game/stop")
  let json = await response.json();
  console.log(json)
}

giveDrawBtn.addEventListener('click', drawWinner)

async function drawWinner(){
  let response = await fetch(window.location + "giveaway/game/draw")
  let json = await response.json();
  console.log(json)
}

giveClearBtn.addEventListener('click', clearGiveawa)

async function clearGiveawa(){
  let response = await fetch(window.location + "giveaway/game/clear")
  let json = await response.json();
  console.log(json)
}

let randNumInput = document.getElementById("randomNumInput")
const randomStartBtn = document.getElementById("randomStartBtn")
const randomStopBtn = document.getElementById("randomStopBtn")

randomStartBtn.addEventListener('click', startRandNum)

async function startRandNum(){
  let response = await fetch(window.location + "randNum/" + randNumInput.value + "+" + dropDown.value)
  let json = await response.json();
  console.log(json)
}

randomStopBtn.addEventListener('click', stopRandNum)

async function stopRandNum(){
  let response = await fetch(window.location + "randNum/game/clear")
  let json = await response.json();
  console.log(json)
}

const quidditchStartBtn = document.getElementById("quidditchStartBtn")
const quidditchStopBtn = document.getElementById("quidditchStopBtn")
const quidditchClearBtn = document.getElementById("quidditchClearBtn")
const quidditchPayoutsBtn = document.getElementById("quidditchPayoutsBtn")

quidditchStartBtn.addEventListener('click', startQuidditch)

async function startQuidditch(){
  let response = await fetch(window.location + "quidditch/" + dropDown.value);
  let json = await response.json();
  console.log(json);
}

quidditchStopBtn.addEventListener('click', stopQuidditch)

async function stopQuidditch(){
  let response = await fetch(window.location + "quidditch/game/over");
  let json = await response.json();
  console.log(json);
}

quidditchClearBtn.addEventListener('click', clearQuidditch);

async function clearQuidditch(){
  let response = await fetch(window.location + "quidditch/game/clear");
  let json = await response.json();
  console.log(json);
}

quidditchPayoutsBtn.addEventListener('click', quidditchPayout);

async function quidditchPayout(){
  let response = await fetch(window.location + "quidditch/game/payout");
  let json = await response.json();
  console.log(json);
}

const clearAllBtn = document.getElementById("clearAllBtn")

clearAllBtn.addEventListener('click', clearAllGames)

async function clearAllGames(){
  clearAll();
  let response = await fetch(window.location + "clear/all");
  let json = await response.json();
  console.log(json);
}