'use strict';

var mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	FacebookStrategy = require('passport-facebook').Strategy,
	TwitterStrategy  = require('passport-twitter').Strategy,
	GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy,
	User = mongoose.model('User');

// Serialize sessions
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findOne({ _id: id }, function (err, user) {
		done(err, user);
	});
});

// Use local strategy
passport.use('local', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function(email, password, done) {
		if(email) {
			email = email.toLowerCase();
		}

		User.findOne({ 'email': email }, function (err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, {
					'errors': {
						'email': { type: 'Email is not registered.' }
					}
				});
			}
			if (!user.authenticate(password)) {
				return done(null, false, {
					'errors': {
						'password': { type: 'Password is incorrect.' }
					}
				});
			}
			return done(null, user);
		});
	}
));
