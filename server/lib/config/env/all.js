'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/../../../client');

module.exports = {
	port: process.env.PORT || 9000,
	root: rootPath,
	server: {
		staticUrl: '/static', // The base url from which we serve static files (such as js, css and images)
		cookieSecret: 'mytest-app' // The secret for encrypting the cookie
	}
};