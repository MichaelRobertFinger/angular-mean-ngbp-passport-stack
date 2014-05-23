'use strict';

/**
 * @ngdoc overview
 * @name http-error-handling
 * @description
 *
 * Module that provides global http error handling for apps.
 *
 * Usage:
 * Hook the file in to your index.html: <script src="where-eva/http-error-handling.js"></script>
 * Add <div class="http-error-messages" http-error-messages></div> to the index.html at the position you want to
 * display the error messages.
 */
angular.module('http-error-handling', [])
	.config(function ($provide, $httpProvider, $compileProvider) {
		var elementsList = $();

		// this message will appear for a defined amount of time and then vanish again
		var showMessage = function (content, cl, time) {
			time = typeof time !== undefined ? time : 3000;

			// todo: do in a directive -- not jquery
			$('<div/>')
				.addClass(cl)
				.hide()
				.fadeIn('fast')
				.delay(time)
				.fadeOut('fast', function () {
					$(this).remove();
				})
				.appendTo(elementsList)
				.text(content);
		};

		// push function to the responseInterceptors which will intercept
		// the http responses of the whole application
		$httpProvider.responseInterceptors.push(function ($timeout, $q) {
			return function (promise) {
				return promise.then(function (successResponse) {
						// if there is a successful response on POST, UPDATE or DELETE
						if (successResponse.config.method.toUpperCase() !== 'GET') {
							showMessage('Success', 'http-success-message', 5000);
						}

						return successResponse;
					},
					// if the message returns unsuccessful we display the error
					function (errorResponse) {
						switch (errorResponse.status) {
							case 400: // if the status is 400 we return the error
								showMessage(errorResponse.data.message, 'http-error-message', 6000);
								// if we have found validation error messages we will loop through
								// and display them
								if (errorResponse.data.errors.length > 0) {
									for (var i = 0; i < errorResponse.data.errors.length; i++) {
										showMessage(errorResponse.data.errors[i],
											'http-error-validation-message', 6000);
									}
								}
								break;
							case 401: // if the status is 401 we return access denied
								showMessage('Authentication Required', 'http-error-message', 6000);
								break;
							case 403: // if the status is 403 we tell the user that authorization was denied
								showMessage('You have insufficient privileges to do what you want to do!',
									'http-error-message', 6000);
								break;
							case 500: // if the status is 500 we return an internal server error message
								showMessage('Internal server error: ' + errorResponse.data.message,
									'http-error-message', 6000);
								break;
							default: // for all other errors we display a default error message
								showMessage('Error ' + errorResponse.status + ': ' + errorResponse.data.message,
									'http-error-message', 6000);
						}
						return $q.reject(errorResponse);
					});
			};
		});

		// this will display the message if there was a http return status
		$compileProvider.directive('httpErrorMessages', function () {
			return {
				link: function (scope, element, attrs) {
					elementsList.push($(element));
				}
			};
		});
	});
