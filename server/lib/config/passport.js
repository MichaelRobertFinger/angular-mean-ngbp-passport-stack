'use strict';

var mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	FacebookStrategy = require('passport-facebook').Strategy,
	TwitterStrategy = require('passport-twitter').Strategy,
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	User = mongoose.model('User'),
	config = require('./config');

// Serialize sessions
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findOne({ _id: id }, function (err, user) {
		done(err, user);
	});
});

// Use local strategy
passport.use('local', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function (email, password, done) {
		if (email) {
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

// Google
passport.use(new GoogleStrategy({

		clientID: config.googleAuth.clientID,
		clientSecret: config.googleAuth.clientSecret,
		callbackURL: config.googleAuth.callbackURL,
		passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

	},
	function (req, token, refreshToken, profile, done) {

		// asynchronous
		process.nextTick(function () {

			// check if the user is already logged in
			if (!req.user) {

				User.findOne({ 'google.id': profile.id }, function (err, user) {
					if (err)
						return done(err);

					if (user) {

						// if there is a user id already but no token (user was linked at one point and then removed)
						if (!user.google.token) {
							user.google.token = token;
							user.google.name = profile.displayName;
							user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

							user.save(function (err) {
								if (err)
									throw err;
								return done(null, user);
							});
						}

						return done(null, user);
					} else {
						var newUser = new User();

						newUser.google.id = profile.id;
						newUser.google.token = token;
						newUser.google.name = profile.displayName;
						// pull the first email
						newUser.google.email = newUser.name = (profile.emails[0].value || '').toLowerCase();

						newUser.save(function (err) {
							if (err)
								throw err;
							return done(null, newUser);
						});
					}
				});

			} else {
				// user already exists and is logged in, we have to link accounts
				var user = req.user; // pull the user out of the session

				user.google.id = profile.id;
				user.google.token = token;
				user.google.name = profile.displayName;
				// pull the first email
				user.google.email = newUser.name = (profile.emails[0].value || '').toLowerCase();

				user.save(function (err) {
					if (err)
						throw err;
					return done(null, user);
				});

			}

		});
	}));
