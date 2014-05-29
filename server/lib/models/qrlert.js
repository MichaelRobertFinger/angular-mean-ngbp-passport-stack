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
	updated: Date,
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

// Validations
QrlertSchema.path('url').validate(function (url) {
	var urlRegex = /^(http[s]?:\/\/)?(www\.)?([^\@]\w*)\.\w{2,4}$/;
	return urlRegex.test(url);
}, 'The specified url is invalid.');

//pre-save hook
QrlertSchema.pre('save', function(next) {
	if(this.isNew)
	{
		this.created = Date.now();
	} else {
		this.updated = Date.now();
	}

	next();
});

mongoose.model('Qrlert', QrlertSchema);