'use strict';

var frisby = require('frisby');
var app = 'http://localhost:9000';

describe('Route Tests', function () {
	frisby.create('GET /auth/google')
		.get(app + '/auth/google')
		.expectStatus(200)
		.toss();

});
