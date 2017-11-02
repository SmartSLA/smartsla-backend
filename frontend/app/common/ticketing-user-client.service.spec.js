'use strict';

describe('The ticketingUserClient service', function() {
  var API_PATH = '/ticketing/api/users';
  var $httpBackend;
  var ticketingUserClient;

  beforeEach(module('linagora.esn.ticketing'));

  beforeEach(inject(function(_$httpBackend_, _ticketingUserClient_) {
    $httpBackend = _$httpBackend_;
    ticketingUserClient = _ticketingUserClient_;
  }));

  describe('The create function', function() {
    it('should POST to right endpoint to create a new user', function() {
      var user = { firstname: 'foo', lastname: 'bar', email: 'foo@tic.org', main_phone: '888' };

      $httpBackend.expectPOST(API_PATH, user).respond(201, {});

      ticketingUserClient.create(user);
      $httpBackend.flush();
    });
  });

  describe('The update function', function() {
    it('should PUT to right endpoint to udpate user', function() {
      var userId = '123';
      var updateData = { firstname: 'foo', lastname: 'bar', email: 'foo@tic.org', main_phone: '888' };

      $httpBackend.expectPUT(API_PATH + '/' + userId, updateData).respond(204);

      ticketingUserClient.update(userId, updateData);

      $httpBackend.flush();
    });
  });

  describe('The get function', function() {
    it('should GET to right endpoint to get user', function() {
      var userId = '123';

      $httpBackend.expectGET(API_PATH + '/' + userId).respond(200, {});

      ticketingUserClient.get(userId);

      $httpBackend.flush();
    });
  });

  describe('The list function', function() {
    it('should GET to right endpoint to list users', function() {
      var options = {};

      $httpBackend.expectGET(API_PATH).respond(200, []);

      ticketingUserClient.list(options);

      $httpBackend.flush();
    });
  });
});
