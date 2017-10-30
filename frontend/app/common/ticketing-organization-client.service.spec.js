'use strict';

describe('The ticketingOrganizationClient service', function() {
  var $httpBackend;
  var ticketingOrganizationClient;

  beforeEach(module('linagora.esn.ticketing'));

  beforeEach(inject(function(_$httpBackend_, _ticketingOrganizationClient_) {
    $httpBackend = _$httpBackend_;
    ticketingOrganizationClient = _ticketingOrganizationClient_;
  }));

  describe('The create function', function() {
    it('should POST to right endpoint to create a new organization', function() {
      var organization = { foo: 'baz' };

      $httpBackend.expectPOST('/ticketing/api/organizations', organization).respond(200, {});

      ticketingOrganizationClient.create(organization);
      $httpBackend.flush();
    });
  });

  describe('The list function', function() {
    it('should get to right endpoint to list organizations', function() {
      var options = {};

      $httpBackend.expectGET('/ticketing/api/organizations').respond(200, []);

      ticketingOrganizationClient.list(options);

      $httpBackend.flush();
    });
  });

  describe('The update function', function() {
    it('should POST to right endpoint to udpate', function() {
      var organizationId = '123';
      var updateData = { foo: 'baz' };

      $httpBackend.expectPUT('/ticketing/api/organizations/' + organizationId, updateData).respond(200, []);

      ticketingOrganizationClient.update(organizationId, updateData);

      $httpBackend.flush();
    });
  });

  describe('The get function', function() {
    it('should GET to right endpoint to get organization', function() {
      var organizationId = '123';

      $httpBackend.expectGET('/ticketing/api/organizations/' + organizationId).respond(200, {});

      ticketingOrganizationClient.get(organizationId);

      $httpBackend.flush();
    });
  });
});
