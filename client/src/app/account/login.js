'use strict';

angular.module('myTestApp.account.login', ['ui.router'])
	.config(function config($stateProvider) {
		$stateProvider.state('login', {
			url: '/login',
			views: {
				'main': {
					controller: 'LoginController',
					templateUrl: 'account/login.tpl.html'
				}
			},
			data: { pageTitle: 'Login' }
		});
	})
	.controller('LoginController', [ '$scope', 'Auth', '$location',
		function LoginController($scope, Auth, $location) {
			$scope.error = {};
			$scope.user = {};

			$scope.login = function (form) {
				Auth.login('password', {
						email: $scope.user.email,
						password: $scope.user.password
					},
					function (err) {
						$scope.errors = {};

						if (!err) {
							$location.path('/');
						} else {
							angular.forEach(err.errors, function (error, field) {
								form[field].$setValidity('mongoose', false);
								$scope.errors[field] = error.type;
							});
						}
					}
				);
			};
		}]);