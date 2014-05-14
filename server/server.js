'use strict';

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express'),
	favicon = require('static-favicon'),
	morgan = require('morgan'),
	compression = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	errorHandler = require('errorhandler'),
	path = require('path'),
	http = require('http'),
	NodeCache = require('node-cache'),
	UserHandler = require('./lib/handlers/UserHandler'),
	AuthHandler = require('./lib/handlers/AuthHandler'),
	passport = require('passport'),
	mongoose = require('mongoose'),
	UserDB = require('./lib/models/user'),
	config = require('./lib/config/config');

var app = express();

var google_strategy = require('passport-google-oauth').OAuth2Strategy;

var env = app.get('env');

if ('development' === env) {
	app.use(require('connect-livereload')());

	// Disable caching of scripts for easier testing
	app.use(function noCache(req, res, next) {
		if (req.url.indexOf('/src/') === 0) {
			res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
			res.header('Pragma', 'no-cache');
			res.header('Expires', 0);
		}
		next();
	});
}

if ('production' === env) {
	// Serve up the favicon
	app.use(compression());
	app.use(favicon(config.server.distFolder + '/favicon.ico'));
}

//app.set('client-url','http://localhost:9000');
//app.set('client-google-signin','/google?action=signin');

app.use(express.static(path.join(config.root, 'build')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(morgan('dev'));
app.use(bodyParser());
app.use(methodOverride());
app.use(cookieParser());
app.use(passport.initialize());

// Error handler - has to be last
if ('development' === app.get('env')) {
	app.use(errorHandler());
}

mongoose.connect(config.db);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	console.log("Connected to db");
});

passport.use(new google_strategy({
		clientID: '665254621941-jpdrphk5p0tbnapt8nsrvo0sgi9llpeg.apps.googleusercontent.com',
		clientSecret: 'xtiWDkT_YvQzXi096-AmeQTr',
		callbackURL: 'http://localhost:9000/auth/google/callback'
	},
	function (accessToken, refreshToken, profile, done) {
		console.log('google strategy' + accessToken);
		console.log('google profile' + profile._json.email);
		UserDB.findOne({email: profile._json.email}, function (err, usr) {
			if (usr == null) {
				usr = new UserDB({
					'email': profile._json.email,
					'last_name': '',
					'first_name': ''
				});
				console.log('usr is:' + usr);
			}
			usr.token = accessToken;
			usr.save(function (err, usr, num) {
				if (err) {
					console.log('error saving token' + err);
				} else {
					console.log('usr saved');
				}
			});
			process.nextTick(function () {
				return done(null, profile);
			});
		});
	}
));


var handlers = {
	user: new UserHandler(),
	auth: new AuthHandler()
};

require('./lib/routes')(app, config, handlers);

app.cache = new NodeCache();

// allow express server to be started with a callback (useful in testing)
app.start = function (config, readyCallback) {
	if (!this.server) {

		this.server = app.listen(config.port, function () {

			console.log('Server running on port %d in %s mode', config.port, app.get('env'));

			// callback to call when the server is ready
			if (readyCallback) {
				readyCallback();
			}
		});
	}
};

app.close = function () {
	this.server.close();
};

// Expose app
exports = module.exports = app;






