var express = require('express');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride  = require("method-override");
var session = require('express-session')

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');
app.engine('html', require('hbs').__express);
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(methodOverride());

/*
	We need to initialize our session using the properties 'resave' and 'saveUninitialized' 
	otherwise we will get deprecation warnings
*/
app.use(session({
	secret: 'javascript is awesome',
	resave: false,
	saveUninitialized: true
}))


var TWITTER_CONSUMER_KEY = "OxM33kKQD7K1qWPRThd2qdvCT";
var TWITTER_CONSUMER_SECRET = "PIy4fltLLB0oWZtYX8CGbnOBdVQBu8HqskWkdRT15ZE8Un6EQZ";


/*
	Passport session setup.
	To support persistent login sessions, Passport needs to be able to
	serialize users into and deserialize users out of the session.  Typically,
	this will be as simple as storing the user ID when serializing, and finding
	the user by ID when deserializing.  However, since this example does not
	have a database of user records, the complete Twitter profile is serialized
	and deserialized.

*/
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});


/*
	Use the TwitterStrategy within Passport.
	Strategies in passport require a `verify` function, which accept
	credentials (in this case, a token, tokenSecret, and Twitter profile), and
	invoke a callback with a user object.
*/
passport.use( new TwitterStrategy({
	
	consumerKey: TWITTER_CONSUMER_KEY,
	consumerSecret: TWITTER_CONSUMER_SECRET,
	callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"

}, function(token, tokenSecret, profile, done) {
	
	process.nextTick(function () {
		return done(null, profile);
	});

}));

/*
	Initialize Passport!  Also use passport.session() middleware, to support
	persistent login sessions (recommended).
*/
app.use(passport.initialize());
app.use(passport.session());


var server = app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + server.address().port);
});

app.get('/', function(req, res){
	res.render('index.html', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
	console.log(req.user);
	res.render('account.html', { user: req.user });
});

app.get('/login', function(req, res){
	res.render('login.html', { user: req.user });
});


/*
	GET /auth/twitter
	Use passport.authenticate() as route middleware to authenticate the
	request.  The first step in Twitter authentication will involve redirecting
	the user to twitter.com.  After authorization, the Twitter will redirect
	the user back to this application at /auth/twitter/callback
*/
app.get('/auth/twitter',
	passport.authenticate('twitter'),
	function(req, res){
		// The request will be redirected to Twitter for authentication, so this
		// function will not be called.
	});


/*
	GET /auth/twitter/callback
	Use passport.authenticate() as route middleware to authenticate the
	request.  If authentication fails, the user will be redirected back to the
	login page.  Otherwise, the primary route function function will be called,
	which, in this example, will redirect the user to the home page.
*/
app.get('/auth/twitter/callback', 
	passport.authenticate('twitter', { failureRedirect: '/login' }),
	function(req, res) {
		res.redirect('/');
	});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});


/*
	Simple route middleware to ensure user is authenticated.
	Use this route middleware on any resource that needs to be protected.  If
	the request is authenticated (typically via a persistent login session),
	the request will proceed.  Otherwise, the user will be redirected to the
	login page.
*/
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}