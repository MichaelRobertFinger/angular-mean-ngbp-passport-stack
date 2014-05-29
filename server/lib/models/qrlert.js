'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var QrlertSchema = new Schema({
	code: {
		type: String,
		unique: true,
		required: true
	},
	url: String,
	created: Date,
	updated: [Date],
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

// Validations
/*
UserSchema.path('email').validate(function (email) {
	var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	return emailRegex.test(email);
}, 'The specified email is invalid.');
*/

mongoose.model('Qrlert', QrlertSchema);