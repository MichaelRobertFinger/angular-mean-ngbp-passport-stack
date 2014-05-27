'use strict';

angular.module('myTestApp')
	.directive('uniqueEmail', function ($http) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, element, attrs, ngModel) {
				function validate(value) {
					if(!value) {
						ngModel.$setValidity('unique', true);
						return;
					}
					$http.get('/auth/check_email/' + value).success(function(user) {
						if(!user.exists) {
							ngModel.$setValidity('unique', true);
						} else {
							ngModel.$setValidity('unique', false);
						}
					});
				}

				scope.$watch( function() {
					return ngModel.$viewValue;
				}, validate);
			}
		};
	});