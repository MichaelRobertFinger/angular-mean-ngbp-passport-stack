'use strict';

describe('Controller: NavbarController', function () {

	// load the controller's module
	beforeEach(module('myTestApp'));

	var NavbarController,
		scope,
		Auth,
		$httpBackend;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _Auth_) {
		$httpBackend = _$httpBackend_;
		scope = $rootScope.$new();
		Auth = _Auth_;
		NavbarController = $controller('NavbarController', {
			$scope: scope
		});
	}));

	it('should not log out user if an error occurs when calling logout', inject(function () {
		// mock user
		var user = {'email': 'test', 'password':'pass', username:'bob' };
		//$httpBackend.expectDELETE('/auth/session').respond({});
		spyOn(Auth, 'logout').andReturn('error');

		scope.currentUser = user;
		expect(scope.currentUser.username).toBe(user.username);

		scope.logout();

		expect(scope.currentUser.username).toBe(user.username);
	}));
});
