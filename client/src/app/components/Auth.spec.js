'use strict';

describe('Service: Auth', function () {
	beforeEach(module('myTestApp'));

	var $httpBackend, Auth, $rootScope, user, $q;

	var sessionUrl = '/auth/session';
	var userUrl = '/auth/users';

	beforeEach(inject(function (_$httpBackend_, _Auth_, _$rootScope_) {
		$httpBackend = _$httpBackend_;
		Auth = _Auth_;
		$rootScope = _$rootScope_;

		user = { 'email': 'test', 'password': 'pass' };
	}));

	it('should logout user', function () {
		$httpBackend.expect('DELETE', sessionUrl).respond({});
		$httpBackend.whenGET(sessionUrl).respond({});

		$rootScope.currentUser = user;
		expect($rootScope.currentUser.email).toBe(user.email);

		Auth.logout();

		$httpBackend.flush();

		expect($rootScope.currentUser).toBe(null);
	});

//	it('should create a user', function () {
//		$httpBackend.expect('POST', userUrl).respond()
//		var result;
//
//		expect($rootScope.currentUser).toBe(null);
//		Auth.createUser(user);
//
//		$httpBackend.flush();
//
//		expect($rootScope.currentUser).toBe(user);
//	});
});
