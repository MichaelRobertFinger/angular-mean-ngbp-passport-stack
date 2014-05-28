'use strict';

var mongoose = require('mongoose');
require('./user');
var User = mongoose.model('User'),
	config = require('../config/env/test');
mongoose.connect(config.db);

describe('User: save', function () {
	var user = new User();
	var expected = { email: 'foo@foo.com', password: 'barbar' };

	beforeEach(function () {
	});

	it('should save a local user', function () {
		var actual = null;

		user.email = expected.email;
		user.password = expected.password;

		runs(function () {
			user.save(function (err) {
				console.log('err: ' + err);
			});
		});

		waits(300);

		runs(function () {
			User.find({ email: expected.email}, function (err, user) {
				actual = user;
			});
		});

		waits(300);

		runs(function () {
			console.log('actual: ' + actual);
			console.log('expected email == ' + expected.email);
			expect(actual.email).toBe(expected.email);
		});
	});

	afterEach(function () {
		/*
		 user.remove({}, function () {
		 console.log('removed user from db');
		 });
		 */
	});
});


