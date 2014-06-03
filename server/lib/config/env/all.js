'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/../../../../client');

module.exports = {
	port: process.env.PORT || 9000,
	root: rootPath,
	server: {
		distFolder: path.resolve(rootPath, 'build'),
		staticUrl: '/static', // The base url from which we serve static files (such as js, css and images)
		cookieSecret: 'mytest-app' // The secret for encrypting the cookie
	},
	'facebookAuth': {
		'clientID': 'your-secret-clientID-here', // your App ID
		'clientSecret': 'your-client-secret-here', // your App Secret
		'callbackURL': 'http://localhost:9000/auth/facebook/callback'
	},

	'twitterAuth': {
		'consumerKey': 'your-consumer-key-here',
		'consumerSecret': 'your-client-secret-here',
		'callbackURL': 'http://localhost:9000/auth/twitter/callback'
	},

	'googleAuth': {
		'clientID': '',
		'clientSecret': '',
		'callbackURL': 'http://localhost:9000/auth/google/callback'
	}
};