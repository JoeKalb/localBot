const express = require('express')
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

var listener = app.listen(process.env.PORT, function() {
  console.log('Listening on port ', + listener.address().port)
  app.get('/', (req, res) => res.send('Hello World!'))
});

const http = require('http').Server(app);
const path = require('path');
const webPort = 8000;

app.use('/', express.static(path.join(__dirname + '/')));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let routes = require('./Routes')

app.use('', routes)

http.listen(webPort, () => {
  console.log('Mod Helper app listening on port ' + webPort);
});
