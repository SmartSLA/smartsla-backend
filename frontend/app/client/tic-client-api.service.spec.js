'use strict';

describe('The ticClientApi service', function() {
  var $httpBackend, ticClientApiService;

  beforeEach(function() {
    angular.mock.module('linagora.esn.ticketing');

    angular.mock.inject(function(_$httpBackend_, _ticClientApiService_) {
      $httpBackend = _$httpBackend_;
      ticClientApiService = _ticClientApiService_;
    });
  });

  describe('the getClients function', function() {
    it('should send a request to /linagora.esn.ticketing/api/clients', function() {
      $httpBackend.expectGET('/linagora.esn.ticketing/api/clients').respond(200, []);
      ticClientApiService.getClients();

      $httpBackend.flush();
    });
  });

  describe('the createClient function', function() {
    var client;

    beforeEach(function() {
      client = {
        name: 'Test'
      };
    });

    it('should send a request to /linagora.esn.ticketing/api/clients', function() {
      $httpBackend.expectPOST('/linagora.esn.ticketing/api/clients', client).respond(200, []);
      ticClientApiService.createClient(client);

      $httpBackend.flush();
    });
  });

  describe('the updateClient function', function() {
    var client;
    var clientId = '123';

    beforeEach(function() {
      client = {
        _id: clientId,
        name: 'Test'
      };
    });

    it('should send a request to /linagora.esn.ticketing/api/clients', function() {
      $httpBackend.expectPUT('/linagora.esn.ticketing/api/clients/' + clientId, client).respond(200, []);
      ticClientApiService.updateClient(clientId, client);

      $httpBackend.flush();
    });
  });

  describe('the getClient function', function() {
    it('should send a request to /linagora.esn.ticketing/api/clients', function() {
      var clientId = '1';

      $httpBackend.expectGET('/linagora.esn.ticketing/api/clients/' + clientId).respond(200, {});
      ticClientApiService.getClient(clientId);

      $httpBackend.flush();
    });
  });

  describe('the deleteClient function', function() {
    it('should send a request to /linagora.esn.ticketing/api/clients', function() {
      var clientId = '2';

      $httpBackend.expectDELETE('/linagora.esn.ticketing/api/clients/' + clientId).respond(204, {});
      ticClientApiService.deleteClient(clientId);

      $httpBackend.flush();
    });
  });

});
