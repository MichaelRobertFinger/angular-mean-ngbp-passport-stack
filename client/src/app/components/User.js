'use strict';

angular.module('myTestApp')
	.factory('User', function ($resource) {
		return $resource('/auth/users/:id/', {},
			{
				'update': {
					method:'PUT'
				}
			});
	});
