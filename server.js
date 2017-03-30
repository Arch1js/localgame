// server.js

// set up ======================================================================
// get all the tools we need

var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var passportSocketIo = require('passport.socketio');
var flash    = require('connect-flash');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');
var express = require('express'),
  env = process.env.NODE_ENV || 'development';

var forceSsl = function (req, res, next) { //enable for ssl on heroku
   if (req.headers['x-forwarded-proto'] !== 'https') {
       return res.redirect(['https://', req.get('Host'), req.url].join(''));
   }
   return next();
};

app.use(forceSsl);
// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration
var oneDay = 86400000;
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(express.static(__dirname + '/views',{ maxAge: oneDay }));
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovetocodethisapp' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport, io); // load our routes and pass in our app and fully configured passport
require('./app/chat-server.js')(app,passport,io);
// launch ======================================================================
http.listen(port);
console.log('The magic happens on port ' + port);
