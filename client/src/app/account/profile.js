'use strict';

angular.module('myTestApp.account.profile', ['ui.router'])
	.config(function config($stateProvider) {
		$stateProvider.state('profile', {
			url: '/profile',
			views: {
				'main': {
					controller: 'ProfileController',
					templateUrl: 'account/profile.tpl.html'
				}
			},
			data: { pageTitle: 'User Profile' }
		});
	})
	.controller('ProfileController', [ '$rootScope', '$scope', 'Auth', '$location',
		function ProfileController($rootScope, $scope, Auth, $location) {
			Auth.currentUser();
			if ($rootScope.currentUser) {
				$scope.user = currentUser;
			}
		}]);
