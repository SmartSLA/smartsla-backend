'use strict';

describe('The ticketingContractClient service', function() {
  var $httpBackend;
  var ticketingContractClient;

  beforeEach(module('linagora.esn.ticketing'));

  beforeEach(inject(function(_$httpBackend_, _ticketingContractClient_) {
    $httpBackend = _$httpBackend_;
    ticketingContractClient = _ticketingContractClient_;
  }));

  describe('The create function', function() {
    it('should POST to right endpoint to create a new contract', function() {
      var contract = { foo: 'baz' };

      $httpBackend.expectPOST('/ticketing/api/contracts', contract).respond(200, {});

      ticketingContractClient.create(contract);
      $httpBackend.flush();
    });
  });

  describe('The list function', function() {
    it('should get to right endpoint to list contracts', function() {
      var options = {};

      $httpBackend.expectGET('/ticketing/api/contracts').respond(200, []);

      ticketingContractClient.list(options);

      $httpBackend.flush();
    });
  });

  describe('The get function', function() {
    it('should GET to right endpoint to get a contract', function() {
      var contractId = '123';

      $httpBackend.expectGET('/ticketing/api/contracts/' + contractId).respond(200, {});

      ticketingContractClient.get(contractId);
      $httpBackend.flush();
    });
  });

  describe('The update function', function() {
    it('should POST to right endpoint to udpate', function() {
      var contractId = '123';
      var updateData = { foo: 'baz' };

      $httpBackend.expectPOST('/ticketing/api/contracts/' + contractId, updateData).respond(200, []);

      ticketingContractClient.update(contractId, updateData);

      $httpBackend.flush();
    });
  });

  describe('The updatePermissions function', function() {
    it('should POST to right endpoint to udpate permissions', function() {
      var contractId = '123';
      var updatePermissions = { permissions: ['baz'] };

      $httpBackend.expectPOST('/ticketing/api/contracts/' + contractId + '/permissions', updatePermissions).respond(204);

      ticketingContractClient.updatePermissions(contractId, updatePermissions);

      $httpBackend.flush();
    });
  });

  describe('The addSoftware function', function() {
    it('should POST to right endpoint to add software', function() {
      var contractId = '123';
      var software = { foo: 'bar' };

      $httpBackend.expectPOST('/ticketing/api/contracts/' + contractId + '/software', software).respond(204);

      ticketingContractClient.addSoftware(contractId, software);

      $httpBackend.flush();
    });
  });

  describe('The addDemand function', function() {
    it('should POST to right endpoint to add demand', function() {
      var contractId = '123';
      var demand = { foo: 'bar' };

      $httpBackend.expectPOST('/ticketing/api/contracts/' + contractId + '/demands', demand).respond(204);

      ticketingContractClient.addDemand(contractId, demand);

      $httpBackend.flush();
    });
  });

  describe('The updateSoftware function', function() {
    it('should POST to right endpoint to update software', function() {
      var contractId = '123';
      var softwareId = '456';
      var software = { foo: 'bar' };

      $httpBackend.expectPOST('/ticketing/api/contracts/' + contractId + '/software/' + softwareId, software).respond(204);

      ticketingContractClient.updateSoftware(contractId, softwareId, software);

      $httpBackend.flush();
    });
  });
});
