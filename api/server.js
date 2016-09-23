var express        = require('express');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var morgan         = require('morgan');
var passport       = require('passport');
var flash 	       = require('connect-flash');
var methodOverride = require('method-override');
var session        = require('express-session');
var cors           = require('express-cors');

var app = express();

app.use(cors({
   allowedOrigins: [
       //'http://127.0.0.1:3000',
       //'http://localhost:3000',
       'http://movies.beet.com.br.s3-website-us-west-2.amazonaws.com',
       'http://movies.beet.com.br'
   ]
}));

var port = process.env.PORT || 1313; 		// set our port// load the config

var mongoose   = require('mongoose');
var database   = require('./src/config/database');

mongoose.connect(database.url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser());
app.use(methodOverride());

// required for passport
app.use(session({ secret: 'minutest2015' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./src/config/passport')(passport);

var router = require('./src/routes/main')(app, passport);

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);