'use strict';

var path = require('path'),
	auth = require('./config/auth'),
	passport = require('passport');

module.exports = function (app, config) {
	// User Routes
	var users = require('./controllers/users');
	app.post('/auth/users', users.create);
	app.get('/auth/users/:userId', users.show);

	// Check if username is available
	app.get('/auth/check_email/:email', users.exists);

	app.get('/unlink/google', users.unlinkGoogle);

	// Session Routes
	var session = require('./controllers/session');
	app.get('/auth/session', auth.ensureAuthenticated, session.session);
	app.post('/auth/session', session.login);
	app.del('/auth/session', session.logout);

	// send to google to do the authentication
	app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

	// the callback after google has authenticated the user
	app.get('/auth/google/callback', passport.authenticate('google', {
		successRedirect: '/#profile',
		failureRedirect: '/'
	}));

	// This route deals enables HTML5Mode by forwarding missing files to the index.html
	app.all('/*', function (req, res) {
		// Just send the index.html for other files to support HTML5Mode
		res.sendfile('index.html', { root: config.server.distFolder });
	});

	console.log("Successfully set up routes");
};