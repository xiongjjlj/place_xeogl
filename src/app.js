require('dotenv').config()
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

// local dependencies
const views = require('./routes/views');


// initialize express app
const app = express();

// set POST request body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set routes
app.use('/', views);
app.use('/static', express.static('public'));
app.use('/', express.static('dist'));

// 404 route
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// route error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    status: err.status,
    message: err.message,
  });
});

if (process.env.USE_SSL == 'False'){
  console.log(process.env.PORT)
  var server = http.createServer(app).listen(process.env.PORT, function () {
    var host = '0.0.0.0';
    console.log('http listen on http://'+host+':'+process.env.PORT+'/');
  });
}
else if (process.env.USE_SSL == 'True'){
  var options = {
    key: fs.readFileSync(process.env.SSL_PRIVATE_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
  };
  var server = https.createServer(options, app).listen(parseInt(process.env.PORT), function(){
    console.log("https listening on port " + process.env.PORT);
  });
  console.log(server);
}
else {
  console.log('USE_SSL not correctly specified!!!')
}
