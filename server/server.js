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
	config = require('./lib/config/config');

var app = express();
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

app.use(express.static(path.join(config.root, 'build')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(morgan('dev'));
app.use(bodyParser());
app.use(methodOverride());

// Error handler - has to be last
if ('development' === app.get('env')) {
	app.use(errorHandler());
}

require('./lib/routes')(app, config);

var NodeCache = require("node-cache");
app.cache = new NodeCache();

//app.use(cookieParser());

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






