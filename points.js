const fs = require('fs')
let students = {"joefish5":0,"oi_atomsk_io":2,"danyrddaspanyrd":2,"witchychar":2,"thabuttress":2,"coop3r":3,"minovskyflight":1,"majintb":3,"theshyguy69":1,"maverick825":3,"tonyvirgo":3,"patrioticgrizzly":0,"dinobrutalityx":3,"tripleb85":1,"cjoflannel":0,"tawhite2720":2,"trappmastuh":3,"streamline72":2,"nebhusk32":3,"popthatbabymaker":0,"jeddkay":2,"mythicalmonkey":2,"antonioreyx360":0,"psn_centralpark":0,"phorr":1,"makeetea":0,"periculum9":0,"pixelcruncher":0,"sp4cem0nkey":2,"whatupitsean":1,"eneeliak":2,"donutscurecancer":1,"jarito180":2,"blackdawn1980":2,"cluelessgamer151":2,"dragon1785":2,"darkhatchet7000":2,"annakyns":3,"yuudachi_san":0,"taxikab86":0,"garebear_":3,"pupper8490":2,"alchahest":0,"mistaken_miracles":2,"zombocarnie":0,"sauron2513":0,"ezegen":0,"viperstrikelol":3,"mac_drachma":1,"bigboss138":2,"hgeezy":1,"ryokoie":2,"chrissmith147":0,"jijeryfrits":1,"aardvarkpepper":3,"nodicemike":2,"thisroguelife":0,"zophkiel":2,"deven9484":3,"thatzigygirl":3,"lumberjackdann":0,"duskguard":3,"datfazbear":1,"verlin":3,"eddiethamd":2,"silverstray":2,"darkfrytepanda":2,"unitymind":3,"acjc21":0,"jimmytheguz":0,"reiner72":0,"aofool":3,"inquisitorburnzy":3,"dtricks42":3,"agentsnapcrackle":3,"admisan":2,"aleistercrowwley":3,"tsmax17":0,"cinerdella":2,"eladolo":0,"halfwingseen":2,"bostontom":1,"arkaynan":1,"bobert_r":3,"drdrinks420":3,"sammypno9":0,"lostfoxman":1,"henrynighthawk":1,"scarid":1,"twask3v1n":1,"espioakakeith":2,"firstman1978":0,"nzstephenf":1,"krzykorean87":2,"billdit":0,"chrisofbodom":0,"biggiesnacks":2,"mal5305":1,"monthis":2,"gsoultaker":3,"blacklance":3,"lolghostface":0,"krivas95":1,"carmillawoo":2,"drooyoo":0,"poidasmall":2,"deem518":0,"captaindaikyo":3,"vfx10viper":3,"edgeblade31":0,"roulette_king_yeti":3,"castorr91":3,"wookie":1,"truedarkdogg":2,"nimasho":3,"thepaintmonkey":0,"j_skittah":1,"micktrinus":2,"chadthachillest":0,"du5tiin":3,"heroic_piplup":2,"ms85_hart":3,"ekkonexus":1,"grunderslacks":1,"actionba5tard":0,"neumie92":2,"undead_artist":3,"blackjax":3,"axlyin":3,"itszenoox":3,"realsarge198":0,"goaliezer0":0,"yessiocho":3,"samj30":3,"dafallancaptain":3,"reynte":3,"fenrysk":3,"billwilliams1981":1,"liingy":0,"pandaloreart":3,"drod262":3,"probit":3,"numbzeh":0,"goldsquadronrebel":3,"darthghostface":0,"kgunnzxraven_":0,"gmpleiades":3,"ace0fjacks":2,"sleeping_quill":2,"syl_x":1,"eroot":0,"coldasiceii":1,"crelca":0,"chill0862":2,"kjedi":3,"tyrantsxblood":0,"abbyfabby":0,"cloudsavegaming":1,"ulluki":1,"pickledeggz":1,"toon_decree":1,"beardsofprey":2,"hildeblue":1,"milkham":1,"mensanurse":2,"benefitoftheclout":2,"fleetwood619":3,"daaybot":2,"mbergman22":2,"garceaj":1,"mysteracles":2,"ansinex726":0,"jackiesimi":3,"zackrobotheart":2,"pgdmystic":2,"ashcadelanne":1,"zabanya91":0,"josh_ortega":2,"airbrush_wizard":0,"tiagorb26":1,"yaritstony":3,"superkirby77":1,"srn0va":1,"kennethmyers":0,"thelasthamster":2,"thedrummergirl":1,"biscuitboyusa":3,"lord_mangoat":2,"zraveno":1,"missing_link":1,"itscharmazing":2,"guiltycosplay":3,"darkhatchet600":2,"anomulus0":2,"pr3stss":1,"drago_x172":3,"lfg_joey":1,"nilstryfe":1,"eyequeuex":3,"been_jammin245":0,"samasulee":0,"fittzle16":3,"helladerpy":1,"slickbuilder":3,"xshrimpx":3,"therisenone247":3,"agentjohnny47":3,"harbortownhobbies":1,"flyingpainguin":0,"lemongrenade":2,"tribalgrayfox":3,"thefryingpan":1,"ralkor_targaryen":3,"garzey":1,"kahhlie":2,"difumino":3,"griffihn":0,"merviking":2,"binaryruse":2,"loocian":0,"robertgoodnight":2,"thethingssheplays":0,"kwa_bena":3,"type_40_":0,"rincewindlive":3,"mercdoty":2,"tiago_rb26":1,"ilikeagoodbum":1,"clippinubs":1,"greilark":0}

const files = fs.readdirSync('./logs/hp/thabuttress');
console.log(files)
console.log(students)

const path = '/logs/hp/thabuttress'
let allLogs;

fs.readdir(path, (err, files) => {
    if(err)
        console.log(err)
    else{
        allLogs = files
        //chatStats(allLogs)
    }
})

console.log(allLogs)

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
