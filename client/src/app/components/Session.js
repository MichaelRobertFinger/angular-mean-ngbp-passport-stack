'use strict';

angular.module('myTestApp')
	.factory('Session', function ($resource) {
		return $resource('/auth/session/');
	});
