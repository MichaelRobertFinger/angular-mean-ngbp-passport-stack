var server = require('../../server');

describe('call to auth/google', function() {
	it('should call google sign in and hit passport method in server.js', function() {
		var req = '';
		var res = '';
		var auth = server.AuthHandler();
		auth.googleSignIn(req, res);

	});
});
