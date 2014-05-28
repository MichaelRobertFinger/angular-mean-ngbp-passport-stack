'use strict';

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	passport = require('passport'),
	ObjectId = mongoose.Types.ObjectId;

/**
 * Create user
 * requires: {password, email}
 * returns: {email, password}
 */
exports.create = function (req, res, next) {
	var newUser = new User();
	newUser.email = newUser.name = req.body.email;
	newUser.password = req.body.password;

	newUser.save(function (err) {
		if (err) {
			console.log('error saving user');
			return res.json(400, err);
		}

		console.log('user saved');

		req.logIn(newUser, function (err) {
			if (err) return next(err);
			return res.json(newUser.user_info);
		});
	});
};

/**
 *  Show profile
 *  returns {email, profile}
 */
exports.show = function (req, res, next) {
	var userId = req.params.userId;

	User.findById(ObjectId(userId), function (err, user) {
		if (err) {
			return next(new Error('Failed to load User'));
		}
		if (user) {
			res.send({email: user.email, profile: user.profile });
		} else {
			res.send(404, 'USER_NOT_FOUND');
		}
	});
};

/**
 *  Email exists
 *  returns {exists}
 */
exports.exists = function (req, res, next) {
	var email = req.params.email;
	User.findOne({ 'email': email }, function (err, user) {
		if (err) {
			return next(new Error('Failed to load User ' + email));
		}

		if (user) {
			res.json({exists: true});
		} else {
			res.json({exists: false});
		}
	});
};

exports.unlinkGoogle = function (req, res) {
	var user = req.user;
	user.google.token = undefined;
	user.save(function (err) {
		res.redirect('/profile');
	});
};
