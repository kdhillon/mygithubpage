const beatmaster = require('./beatmaster')
const express = require('express')  

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

// content of index.js
const app = express()  
const port = 3000

//...
    // app.use(express.bodyParser());
    // app.use(express.cookieParser());
    // app.use(express.session({ secret: 'cool beans' }));
    // app.use(express.methodOverride());
    app.use(allowCrossDomain);
    // app.use(app.router);
    app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {  
  beatmaster.onLoad()
  var song = beatmaster.generateSong()
  response.send(JSON.stringify(song))
})

app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
