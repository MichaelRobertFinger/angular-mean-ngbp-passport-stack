'use strict';

describe('Service: Auth', function () {
	beforeEach(module('myTestApp'));

	var $httpBackend, Auth, $rootScope, user, $q;

	var sessionUrl = '/auth/session';

	beforeEach(inject(function (_$httpBackend_, _Auth_, _$rootScope_) {
		$httpBackend = _$httpBackend_;
		Auth = _Auth_;
		$rootScope = _$rootScope_;

		user = {'email': 'test', 'password': 'pass', username: 'bob' };
	}));

	it('should logout user', function () {
		$httpBackend.expect('DELETE', sessionUrl).respond({});
		$httpBackend.whenGET(sessionUrl).respond({});

		$rootScope.currentUser = user;
		expect($rootScope.currentUser.username).toBe(user.username);

		Auth.logout();

		$httpBackend.flush();

		expect($rootScope.currentUser.username).toBe(undefined);
	});
});
