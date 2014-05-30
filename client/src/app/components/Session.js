'use strict';

angular.module('myTestApp')
	.factory('Session',['$resource', function ($resource) {
		return $resource('/auth/session/');
	}]);
