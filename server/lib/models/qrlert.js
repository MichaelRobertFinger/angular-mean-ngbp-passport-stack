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
