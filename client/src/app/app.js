'use strict';

angular.module('myTestApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'http-auth-interceptor',
	'ui.bootstrap',
	'ui.router',
	'http-error-handling',
	'templates-app',
	'templates-common',
	'myTestApp.home',
	'myTestApp.navbar',
	'myTestApp.account'
])

	.config(function myAppConfig($stateProvider, $urlRouterProvider, $httpProvider) {
		$urlRouterProvider.otherwise('/home');

		var $http,
			interceptor = ['$q', '$injector', function ($q, $injector) {
				var notificationChannel;

				function success(response) {
					// get $http via $injector because of circular dependency problem
					$http = $http || $injector.get('$http');
					// don't send notification until all requests are complete
					if ($http.pendingRequests.length < 1) {
						// get requestNotificationChannel via $injector because of circular dependency problem
						notificationChannel = notificationChannel || $injector.get('requestNotificationChannel');
						// send a notification requests are complete
						notificationChannel.requestEnded();
					}
					return response;
				}

				function error(response) {
					// get $http via $injector because of circular dependency problem
					$http = $http || $injector.get('$http');
					// don't send notification until all requests are complete
					if ($http.pendingRequests.length < 1) {
						// get requestNotificationChannel via $injector because of circular dependency problem
						notificationChannel = notificationChannel || $injector.get('requestNotificationChannel');
						// send a notification requests are complete
						notificationChannel.requestEnded();
					}
					return $q.reject(response);
				}

				return function (promise) {
					// get requestNotificationChannel via $injector because of circular dependency problem
					notificationChannel = notificationChannel || $injector.get('requestNotificationChannel');
					// send a notification requests are complete
					notificationChannel.requestStarted();
					return promise.then(success, error);
				};
			}];

		$httpProvider.responseInterceptors.push(interceptor);
	})

	.run(function ($rootScope, $location, Auth) {

		//watching the value of the currentUser variable.
		$rootScope.$watch('currentUser', function (currentUser) {
			// if no currentUser and on a page that requires authorization then try to update it
			// will trigger 401s if user does not have a valid session
			if (!currentUser && (['/', '/login', '/logout', '/register'].indexOf($location.path()) === -1 )) {
				Auth.currentUser();
			}
		});

		// On catching 401 errors, redirect to the login page.
		$rootScope.$on('event:auth-loginRequired', function () {
			console.log('redirect to login');
			$location.path('/login');
			return false;
		});
	})
	.factory('requestNotificationChannel', ['$rootScope', function ($rootScope) {
		// private notification messages
		var _START_REQUEST_ = '_START_REQUEST_';
		var _END_REQUEST_ = '_END_REQUEST_';

		// publish start request notification
		var requestStarted = function () {
			$rootScope.$broadcast(_START_REQUEST_);
		};
		// publish end request notification
		var requestEnded = function () {
			$rootScope.$broadcast(_END_REQUEST_);
		};
		// subscribe to start request notification
		var onRequestStarted = function ($scope, handler) {
			$scope.$on(_START_REQUEST_, function (event) {
				handler();
			});
		};
		// subscribe to end request notification
		var onRequestEnded = function ($scope, handler) {
			$scope.$on(_END_REQUEST_, function (event) {
				handler();
			});
		};

		return {
			requestStarted: requestStarted,
			requestEnded: requestEnded,
			onRequestStarted: onRequestStarted,
			onRequestEnded: onRequestEnded
		};
	}])
	.directive('loadingWidget', ['requestNotificationChannel', function (requestNotificationChannel) {
		return {
			restrict: 'A',
			link: function (scope, element) {
				// hide the element initially
				element.removeClass('show-me').addClass('hide-me');

				var startRequestHandler = function () {
					// got the request start notification, show the element
					element.removeClass('hide-me').addClass('show-me');
				};

				var endRequestHandler = function () {
					// got the request start notification, show the element
					element.removeClass('show-me').addClass('hide-me');
				};

				requestNotificationChannel.onRequestStarted(scope, startRequestHandler);

				requestNotificationChannel.onRequestEnded(scope, endRequestHandler);
			}
		};
	}])

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
	});

