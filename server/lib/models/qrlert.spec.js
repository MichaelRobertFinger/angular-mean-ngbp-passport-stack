'use strict';

var mongoose = require('mongoose');
require('./qrlert');
var Qrlert = mongoose.model('Qrlert'),
	config = require('../config/env/test');

describe('Qrlert: save', function () {
	beforeEach(function (done) {
		if (!mongoose.connection.db) {
			mongoose.connect(config.db);
		}
		Qrlert.remove({}, done);
	});

	it('should save a qrlert', function (done) {
		var qrlert = new Qrlert();
		qrlert.code = '123';
		qrlert.url = 'http://google.com';

		qrlert.save(done);
	});

	afterEach(function (done) {
done();
	});
});