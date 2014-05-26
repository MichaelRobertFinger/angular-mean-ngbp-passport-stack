'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt   = require('bcrypt-nodejs');

var UserSchema = new Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	username: {
		type: String,
		unique: true,
		required: true
	},
	hashedPassword: String,
	name: String,
	admin: Boolean,
	guest: Boolean,
	provider: String
});

/**
 * Virtuals
 */
UserSchema
	.virtual('password')
	.set(function(password) {
		this._password = password;
		this.hashedPassword = this.encryptPassword(password);
	})
	.get(function() {
		return this._password;
	});

UserSchema
	.virtual('user_info')
	.get(function () {
		return { '_id': this._id, 'username': this.username, 'email': this.email };
	});

/**
 * Validations
 */

var validatePresenceOf = function (value) {
	return value && value.length;
};

UserSchema.path('email').validate(function (email) {
	var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	return emailRegex.test(email);
}, 'The specified email is invalid.');

UserSchema.path('email').validate(function(value, respond) {
	mongoose.models["User"].findOne({email: value}, function(err, user) {
		if(err) throw err;
		if(user) return respond(false);
		respond(true);
	});
}, 'The specified email address is already in use.');

UserSchema.path('username').validate(function(value, respond) {
	mongoose.models["User"].findOne({username: value}, function(err, user) {
		if(err) throw err;
		if(user) return respond(false);
		respond(true);
	});
}, 'The specified username is already in use.');

/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
	if (!this.isNew) {
		return next();
	}

	if (!validatePresenceOf(this.password)) {
		next(new Error('Invalid password'));
	}
	else {
		next();
	}
});

/**
 * Methods
 */

UserSchema.methods = {

	/**
	 * Authenticate - check if the passwords are the same
	 */

	authenticate: function(password) {
		return bcrypt.compareSync(password, this.hashedPassword);
	},

	/**
	 * Encrypt password
	 */

	encryptPassword: function(password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	}
};

mongoose.model('User', UserSchema);