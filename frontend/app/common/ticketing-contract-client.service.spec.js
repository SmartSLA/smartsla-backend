'use strict';

describe('The ticketingContractClient service', function() {
  var $httpBackend;
  var ticketingContractClient;
  var contractId;

  beforeEach(module('linagora.esn.ticketing'));

  beforeEach(inject(function(_$httpBackend_, _ticketingContractClient_) {
    $httpBackend = _$httpBackend_;
    ticketingContractClient = _ticketingContractClient_;
    contractId = 'contractId';
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

      $httpBackend.expectPUT('/ticketing/api/contracts/' + contractId, updateData).respond(200, []);

      ticketingContractClient.update(contractId, updateData);

      $httpBackend.flush();
    });
  });

  describe('The createOrder function', function() {
    it('should POST to right endpoint to create a new order', function() {
      var order = { foo: 'baz' };

      $httpBackend.expectPOST('/ticketing/api/contracts/' + contractId + '/orders', order).respond(200, {});

      ticketingContractClient.createOrder(contractId, order);
      $httpBackend.flush();
    });
  });

  describe('The listOrders function', function() {
    it('should get to right endpoint to list orders', function() {
      var options = {};

      $httpBackend.expectGET('/ticketing/api/contracts/' + contractId + '/orders').respond(200, []);

      ticketingContractClient.listOrders(contractId, options);

      $httpBackend.flush();
    });
  });

  describe('The updateOrder function', function() {
    it('should POST to right endpoint to udpate', function() {
      var orderId = '123';
      var updateData = { foo: 'baz' };

      $httpBackend.expectPUT('/ticketing/api/contracts/' + contractId + '/orders/' + orderId, updateData).respond(200, []);

      ticketingContractClient.updateOrder(contractId, orderId, updateData);

      $httpBackend.flush();
    });
  });
});
