'use strict';

describe('Controller: NavbarController', function () {

	// load the controller's module
	beforeEach(module('myTestApp'));

	var NavbarController,
		scope,
		$httpBackend;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
		scope = $rootScope.$new();
		NavbarController = $controller('NavbarController', {
			$scope: scope
		});
	}));

	it('should have a dummy test', inject(function () {
		$httpBackend.expectPOST('/auth/session').respond(400, {errors:{'model': {type:'Not logged in'}}});

		scope.logout();
		$httpBackend.flush();
		expect(scope.errors.model).toBe('Not logged in');
	}));
});
