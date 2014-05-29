'use strict';

var mongoose = require('mongoose');
require('./qrlert');
require('./user');
var Qrlert = mongoose.model('Qrlert'),
	User = mongoose.model('User'),
	config = require('../config/env/test');
var assert = require('chai').assert;

describe('Qrlert: save', function () {
	beforeEach(function (done) {
		if (!mongoose.connection.db) {
			mongoose.connect(config.db);
		}

		var promise = Qrlert.remove({}, done).exec();
		promise.then(function (done) {
			User.remove({}, done);
		})
	});

	it('should save a qrlert', function (done) {
		var qrlert = new Qrlert();
		qrlert.code = '123';
		qrlert.url = 'google.com';

		qrlert.save(done);
	});

	it('should save a new qrlert and override created with now', function(done) {
		var givenDate = new Date(2000, 1, 1);
		var qrlert = new Qrlert();
		qrlert.code = '123';
		qrlert.created = givenDate;

		qrlert.save(function (err, qrlert) {
			assert.notEqual(qrlert.created, givenDate);
			assert.equal(qrlert.created.year, Date.now().year);
			done();
		});
	});

	it('should save a qrlert with user fk', function (done) {
		var qrlert = new Qrlert();
		var user = new User();

		user.save(function (err, user) {
			qrlert.code = '123';
			qrlert.creator = user;

			qrlert.save(function (err, qrlert) {
				assert.isNull(err);
				assert.isNotNull(qrlert);
				assert.isNotNull(qrlert.creator);
				done();
			});
		});
	});

	it('should validate the url', function (done) {
		var qrlert = new Qrlert();
		qrlert.code = '123';
		qrlert.url = 'foo@foo.com';

		qrlert.save(function (err, qrlert) {
			assert.isNotNull(err);
			assert.equal(err.errors.url.message, 'The specified url is invalid.');
			done();
		});
	});

	it('should not save a qrlert without a code', function (done) {
		var qrlert = new Qrlert();
		qrlert.url = 'google.com';

		qrlert.save(function (err, qrlert) {
			assert.isNotNull(err);
			assert.equal(err.errors.code.type, 'required');
			done();
		});
	});

	afterEach(function (done) {
		done();
	});
});