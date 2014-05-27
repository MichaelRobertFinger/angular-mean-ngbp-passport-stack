'use strict';

angular.module('myTestApp.account.register', ['ui.router'])
	.config(function config($stateProvider) {
		$stateProvider.state('register', {
			url: '/register',
			views: {
				'main': {
					controller: 'RegisterController',
					templateUrl: 'account/register.tpl.html'
				}
			},
			data: { pageTitle: 'Register User' }
		});
	})
	.controller('RegisterController', [ '$scope', 'Auth', '$location',
		function RegisterController($scope, Auth, $location) {
		$scope.register = function(form) {
			Auth.createUser({
					'email': $scope.user.email,
					'password': $scope.user.password
				},
				function(err) {
					$scope.errors = {};

					if (!err) {
						$location.path('/');
					} else {
						angular.forEach(err.errors, function(error, field) {
							form[field].$setValidity('mongoose', false);
							$scope.errors[field] = error.type;
						});
					}
				}
			);
		};
	}]);

