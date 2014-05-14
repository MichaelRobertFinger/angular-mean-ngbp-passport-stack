'use strict';

module.exports = function (app, config, handlers) {
	// redirect to a qrlert (eventually api call) with if/else logic in res to determine a hard redirect
	app.route('/q/:id').get(function (req, res, next) {
		var args = { qrlertId: req.params.id };
		console.log(config.apiUrl);
		res.redirect('http://google.com');
	});

	app.get('/auth/google',handlers.auth.googleSignIn);
	app.get('/auth/google/callback',handlers.auth.googleSignInCallback);
	app.get('/auth/facebook',handlers.auth.facebookSignIn);
	app.get('/auth/facebook/callback',handlers.auth.facebookSignInCallback);
	app.get('/auth/local',handlers.auth.localSignIn);
	app.get('/auth/local/callback',handlers.auth.localSignInCallback);
	app.get('/user',handlers.user.getUsers);
	app.get('/user/:id',handlers.user.getUser);
	app.put('/user/:id',handlers.user.updateUser);
	app.get('/user/:first/:last/:email',handlers.user.createUser);

	// All undefined api routes should return a 404
	app.route('/api/*')
		.get(function (req, res) {
			res.send(404);
		});

	console.log("Successfully set up routes");
};