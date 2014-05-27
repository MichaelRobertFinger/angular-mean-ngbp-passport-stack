'use strict';

var path = require('path'),
	auth = require('./config/auth');

module.exports = function (app, config) {
	// redirect to a qrlert (eventually api call) with if/else logic in res to determine a hard redirect
	app.route('/q/:id').get(function (req, res, next) {
		var args = { qrlertId: req.params.id };
		console.log(config.apiUrl);
		res.redirect('http://google.com');
	});

	// User Routes
	var users = require('./controllers/users');
	app.post('/auth/users', users.create);
	app.get('/auth/users/:userId', users.show);

	// Check if username is available
	// todo: probably should be a query on users
	app.get('/auth/check_email/:email', users.exists);

	// Session Routes
	var session = require('./controllers/session');
	app.get('/auth/session', auth.ensureAuthenticated, session.session);
	app.post('/auth/session', session.login);
	app.del('/auth/session', session.logout);

	// This route deals enables HTML5Mode by forwarding missing files to the index.html
	app.all('/*', function(req, res) {
		// Just send the index.html for other files to support HTML5Mode
		res.sendfile('index.html', { root: config.server.distFolder });
	});

	console.log("Successfully set up routes");
};