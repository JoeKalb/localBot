module.exports = {
  houseNames: ["Gryffindor", "Hufflepuff", "Syltherin", "Ravenclaw"],
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
    taxikab86:0
    //gryf = 0, huff = 1, syl = 2, raven = 3
  },
  getHouse: function(name){
    let check = name.toLowerCase();
    let result = name;
    (this.students.hasOwnProperty(check)) ?
      result += ` is in ${this.houseNames[this.students[check]]}!`:
      result += " has no house yet!"
    return result
  },
  classSizes: function(){
    let classCount = [0, 0, 0, 0]
    for(let key in this.students)
      ++classCount[this.students[key]]

    let result = "Current Class Sizes|"
    for(let i in this.houseNames)
      result += ` ${this.houseNames[i]}: ${classCount[i]} |`

    result += ` ${classCount[0] + classCount[1] + classCount[2] + classCount[3]} Total Students buttOMG`
    return result
  },
  isEnrolled: function(name){
    return this.students.hasOwnProperty(name.toLowerCase());
  },
  myHouse:function(name){
    let lowName = name.toLowerCase()
    if(this.students.hasOwnProperty(lowName)){
      let result = `Here's the current students in 
        ${this.houseNames[this.students[lowName]]} with you ${name}! `
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
    return `Sorry ${name} you don't have a house yet, do !house to find yours!`;
  }
}