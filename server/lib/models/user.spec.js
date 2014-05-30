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

	it('should not save a local user with the same email as an existing user', function (done) {
		var expected = { email: 'foo@foo.com', password: 'barbar' };
		var user = new User();
		user.email = expected.email;
		user.password = expected.password;

		user.save(function (err, user) {
			if (err) return done(err);
			var user2 = new User();
			user2.email = expected.email;
			user2.password = 'fubar';
			user2.save(function (err, user2) {
				assert.isNotNull(err);
				assert.equal('The specified email address is already in use.', err.message);
				done();
			});
		});
	});

	it('should update a local user and pass the email check because they have the same _id', function (done) {
		var expected = { email: 'foo@foo.com', password: 'barbar' };
		var user = new User();
		user.email = expected.email;
		user.password = expected.password;

		user.save(function (err, user) {
			if (err) return done(err);
			user.password = 'fubar';
			user.save(done);
		});
	});

	it('should authenticate password', function (done) {
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
		User.remove({}, done);
	});
});


