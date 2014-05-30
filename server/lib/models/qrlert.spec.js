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
		});
	});

	it('should save a qrlert', function (done) {
		var qrlert = new Qrlert();
		qrlert.url = 'google.com';

		qrlert.save(done);
	});

	it('should save a new qrlert and override created with now', function (done) {
		var givenDate = new Date(2000, 1, 1);
		var qrlert = new Qrlert();
		qrlert.created = givenDate;

		qrlert.save(function (err, qrlert) {
			assert.notEqual(qrlert.created, givenDate);
			assert.equal(qrlert.created.year, Date.now().year);
			done();
		});
	});

	it('should not overwrite created date on update', function (done) {
		var qrlert = new Qrlert();

		//extend the done() default timeout
		this.timeout(3000);

		qrlert.save(function (err, qrlert) {
			var expectedCreated = qrlert.created;
			//set a delay before next save
			setTimeout(function(){
				qrlert.save(function(err, qrlertUpdate) {
					assert.equal(expectedCreated, qrlertUpdate.created);
					assert.notEqual(qrlertUpdate.created, qrlertUpdate.updated);
					done();
				})
			}, 2000);
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
			if (err) return done(err);
			assert.isNull(err);
			assert.isTrue(qrlert.code.length == 8);
			assert.isTrue(qrlert.code.indexOf('q') === 0);
			done();
		});
	});

	it('should save a new qrlert with an auto-generated code that does not match code provided', function (done) {
		var code = '123';
		var qrlert = new Qrlert();
		qrlert.code = code;

		qrlert.save(function (err, qrlert) {
			if (err) return done(err);
			assert.isTrue(qrlert.code !== code);
			assert.isTrue(qrlert.code.length == 8);
			done();
		});
	});

	it('should not overwrite the code of an existing qrlert', function (done) {
		var qrlert = new Qrlert();

		qrlert.save(function (err, qrlert) {
			if (err) return done(err);
			Qrlert.findOne({code: qrlert.code}, function (err, qrlertUpdate) {
				if (err) return done(err);
				qrlertUpdate.save(function (err, qrlertUpdate) {
					assert.equal(qrlertUpdate.code, qrlert.code);
					done();
				});
			});
		});
	});

	it('should generate a code', function () {
		var qrlert = new Qrlert();
		var code = qrlert.generateCode();
		assert.isTrue(code.length === 8);
		assert.isTrue(code.indexOf('q') === 0);
	});

	afterEach(function (done) {
		var promise = Qrlert.remove({}, done).exec();
		promise.then(function (done) {
			User.remove({}, done);
		});
	});
});