
var express = require('express');
var Visa = require('./lib/Visa.js');

var app = express();

var visa = new Visa();

app.use(express.static('bower_components'));
app.use(express.static('static'));

app.get('/', function (req, res, next) {
  next();
});

app.post('/authorize', function (req, res, next) {
  // Authorize credit card
  visa.authorize();
});

app.listen(7800, function () {
  console.log('Example app listening on port 7800!');
});
