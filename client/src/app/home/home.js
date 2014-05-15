'use strict';

angular.module('myTestApp.home', ['ui.router'])
	.config(function config($stateProvider) {
		$stateProvider.state('home', {
			url: '/home',
			views: {
				'main': {
					controller: 'HomeController',
					templateUrl: 'home/home.tpl.html'
				}
			},
			data: { pageTitle: 'Home' }
		});
	})
	.controller('HomeController', function HomeController($scope) {

});

