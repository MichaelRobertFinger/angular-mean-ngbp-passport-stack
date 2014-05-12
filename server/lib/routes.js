'use strict';

module.exports = function (app, config) {
	// redirect to a qrlert (eventually api call) with if/else logic in res to determine a hard redirect
	app.route('/q/:id').get(function (req, res, next) {
		var args = { qrlertId: req.params.id };
		console.log(config.apiUrl);
		res.redirect('http://google.com');
	});

	// All undefined api routes should return a 404
	app.route('/api/*')
		.get(function (req, res) {
			res.send(404);
		});
};