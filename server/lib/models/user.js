'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
	email: String,
	hashedPassword: String,
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	twitter: {
		id: String,
		token: String,
		displayName: String,
		username: String
	},
	google: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	name: String,
	admin: Boolean
});

/**
 * Virtuals
 */
UserSchema
	.virtual('password')
	.set(function (password) {
		this._password = password;
		this.hashedPassword = this.encryptPassword(password);
	})
	.get(function () {
		return this._password;
	});

UserSchema
	.virtual('user_info')
	.get(function () {
		return { '_id': this._id, 'name': this.name, 'email': this.email };
	});

/**
 * Validations
 */
UserSchema.path('email').validate(function (email) {
	var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	return emailRegex.test(email);
}, 'The specified email is invalid.');

// pre-save hook
UserSchema.pre('save', function (next) {
	var currentUser = this;
	// check for existing user, that is not this user, with the same email.
	mongoose.models["User"].findOne({'email': this.email}, function (err, user) {
		if (err) throw err;
		if (user && user.id !== currentUser.id) {
			return next(new Error('The specified email address is already in use.'));
		} else {
			return next();
		}
	});
});

/**
 * Methods
 */

UserSchema.methods = {

	/**
	 * Authenticate - check if the passwords are the same
	 */

	authenticate: function (password) {
		return bcrypt.compareSync(password, this.hashedPassword);
	},

	/**
	 * Encrypt password
	 */

	encryptPassword: function (password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	}
};

mongoose.model('User', UserSchema);