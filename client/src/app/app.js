'use strict';

angular.module('myTestApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'http-auth-interceptor',
	'ui.bootstrap',
	'ui.router',
	'templates-app',
	'templates-common',
	'myTestApp.home',
	'myTestApp.navbar'
])

	.config(function myAppConfig($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/home');
	})

	.run(function ($rootScope, $location, Auth) {

		//watching the value of the currentUser variable.
		$rootScope.$watch('currentUser', function (currentUser) {
			// if no currentUser and on a page that requires authorization then try to update it
			// will trigger 401s if user does not have a valid session
			if (!currentUser && (['/', '/login', '/logout', '/signup'].indexOf($location.path()) === -1 )) {
				Auth.currentUser();
			}
		});

		// On catching 401 errors, redirect to the login page.
		$rootScope.$on('event:auth-loginRequired', function () {
			$location.path('/login');
			return false;
		});
	})

	.controller('AppController', function AppController($scope, Auth, $location) {
		$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			if (angular.isDefined(toState.data.pageTitle)) {
				$scope.pageTitle = toState.data.pageTitle;
			}
		});

		$scope.logout = function () {
			Auth.logout(function (err) {
				if (!err) {
					$location.path('/login');
				}
			});
		};
	})

;

