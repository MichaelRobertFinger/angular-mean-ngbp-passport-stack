'use strict';

angular.module('myTestApp.admin.dashboard', ['ui.router'])
	.config(function config($stateProvider) {
		$stateProvider.state('admin', {
			url: '/admin',
			views: {
				'main': {
					controller: 'AdminDashboardController',
					templateUrl: 'admin/dashboard.tpl.html'
				}
			},
			data: { pageTitle: 'Login' }
		});
	})
	.controller('AdminDashboardController', [ '$scope', 'Auth', '$location',
		function LoginController($scope, Auth, $location) {
		}
	]);
