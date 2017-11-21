'use strict';

describe('The ticketingSoftwareClient service', function() {
  var $httpBackend;
  var ticketingSoftwareClient;

  beforeEach(module('linagora.esn.ticketing'));

  beforeEach(inject(function(_$httpBackend_, _ticketingSoftwareClient_) {
    $httpBackend = _$httpBackend_;
    ticketingSoftwareClient = _ticketingSoftwareClient_;
  }));

  describe('The create function', function() {
    it('should POST to right endpoint to create a new software', function() {
      var software = { foo: 'baz' };

      $httpBackend.expectPOST('/ticketing/api/software', software).respond(201, {});

      ticketingSoftwareClient.create(software);
      $httpBackend.flush();
    });
  });

  describe('The list function', function() {
    it('should get to right endpoint to list software', function() {
      var options = {};

      $httpBackend.expectGET('/ticketing/api/software').respond(200, []);

      ticketingSoftwareClient.list(options);

      $httpBackend.flush();
    });
  });

  describe('The update function', function() {
    it('should PUT to right endpoint to udpate', function() {
      var softwareId = '123';
      var updateData = { foo: 'baz' };

      $httpBackend.expectPUT('/ticketing/api/software/' + softwareId, updateData).respond(204, {});

      ticketingSoftwareClient.update(softwareId, updateData);

      $httpBackend.flush();
    });
  });
});
