'use strict';

var mongoose = require('mongoose');
require('./user');
var User = mongoose.model('User'),
	config = require('../config/env/test');
var assert = require('chai').assert;

describe('User: save', function () {
	beforeEach(function (done) {
		if (!mongoose.connection.db) {
			mongoose.connect(config.db);
		}
		User.remove({}, done);
	});


	it('should save a local user', function (done) {
		var expected = { email: 'foo@foo.com', password: 'barbar' };
		var user = new User();
		user.email = expected.email;
		user.password = expected.password;

		user.save(done);
	});

	if('should authenticate password', function(done) {
		var expected = { email: 'foo@foo.com', password: 'barbar' };
		var user = new User();
		user.email = expected.email;
		user.password = expected.password;

		user.save(function (err, user) {
			if (err) return done(err);
			assert.equal(true, user.authenticate(user.password));
			done();
		});
	});

	afterEach(function (done) {
		done();
	});
});


