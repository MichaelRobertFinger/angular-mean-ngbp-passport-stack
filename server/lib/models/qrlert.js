'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var QrlertSchema = new Schema({
	code: {
		type: String,
		unique: true
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
QrlertSchema.pre('save', function (next) {
	if (this.isNew) {
		this.created = Date.now();
		this.code = this.generateCode();
	} else {
		this.updated = Date.now();
	}

	next();
});

// methods
QrlertSchema.methods = {
	generateCode: function () {
		var code = "q";
		var i = 7;
		var _chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789";
		while(i > 0) {
			code += _chars.substr(Math.floor(Math.random() * _chars.length), 1);
			i--;
		}

		return code;
	}
};

mongoose.model('Qrlert', QrlertSchema);