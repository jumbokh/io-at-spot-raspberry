var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),    
    passport = require('passport'),
    http = require('http'),
    https = require('https');
    
var keys_dir = 'web/keys/';
var  server_options = {
        key  : fs.readFileSync(keys_dir + 'key.pem'),
        cert : fs.readFileSync(keys_dir + 'cert.pem')
      }
    
var app = express(),
    _listener;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(bodyParser.urlencoded({
    extended: true
}));                        //middleware to parse url
app.use(bodyParser.json()); //middleware to parse json
app.use(cookieParser());    //middleware to read cookies (needed for auth)
app.use(session({
    secret: 'supersecret', 
    saveUninitialized: true,
    resave: true
})); //set session parameters

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//Passport
require('./passport')(passport);


// var server = app.listen(80, function () {
// });

https.createServer(server_options, app).listen(443);
http.createServer(app).listen(80);

module.exports = function (listener) {
    //Routing
    require('./routes.js')(app, passport, listener);
};