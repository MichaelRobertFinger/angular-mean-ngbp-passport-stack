'use strict';

angular.module('myTestApp.navbar', ['ui.router'])
	.config(function config($stateProvider) {
		$stateProvider.state('navbar', {
			url: '/navbar',
			views: {
				'main': {
					controller: 'NavbarController',
					templateUrl: 'componenets/navbar.tpl.html'
				}
			},
			data: { pageTitle: 'Home' }
		});
	})
	.controller('NavbarController', function ($scope, $location) {
/*
		$scope.logout = function () {
			Auth.logout(function (err) {
				if (!err) {
					$location.path('/login');
				}
			});
		};
		*/
});