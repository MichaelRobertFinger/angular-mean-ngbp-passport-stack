'use strict';

angular.module('myTestApp.common', ['ui.router'])
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
	.controller('LoginController', function LoginController($scope) {

	});
