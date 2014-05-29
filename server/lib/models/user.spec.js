'use strict';

var mongoose = require('mongoose');
require('./user');
var User = mongoose.model('User'),
	config = require('../config/env/test');
mongoose.connect(config.db);

describe('User: save', function () {
	var expected = { email: 'foo@foo.com', password: 'barbar' };

	beforeEach(function () {
	});

	it('should save a local user', function () {
		var user = new User();
		user.email = expected.email;
		user.password = expected.password;

		user.save(function (err) {
			if (err) throw err;
			done();
		});

		User.findOneAndRemove({ email: expected.email}, function (err, user) {
			var actual = user;
			expect(actual.email).toBe(expected.email);
			done();
		});
	});
});


