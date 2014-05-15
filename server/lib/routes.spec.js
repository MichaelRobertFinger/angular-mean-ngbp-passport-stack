'use strict';

var frisby = require('frisby');
var app = 'http://localhost:9000';

describe('Route Tests', function () {
	frisby.create('POST /auth/users')
		.post(app + '/auth/users', {email: 'me@me.com', username: 'me', password: 'foo'})
		.expectStatus(200)
		.toss();

});
