'use strict';

describe('The TicketingGlossaryClient service', function() {
  var API_PATH = '/ticketing/api/glossaries';
  var $httpBackend;
  var TicketingGlossaryClient;

  beforeEach(module('linagora.esn.ticketing'));

  beforeEach(inject(function(_$httpBackend_, _TicketingGlossaryClient_) {
    $httpBackend = _$httpBackend_;
    TicketingGlossaryClient = _TicketingGlossaryClient_;
  }));

  describe('The create function', function() {
    it('should POST to right endpoint to create a new glossary', function() {
      var glossary = { foo: 'baz' };

      $httpBackend.expectPOST(API_PATH, glossary).respond(201, {});

      TicketingGlossaryClient.create(glossary);
      $httpBackend.flush();
    });
  });

  describe('The list function', function() {
    it('should GET to right endpoint to list glossaries', function() {
      var options = {};

      $httpBackend.expectGET(API_PATH).respond(200, []);

      TicketingGlossaryClient.list(options);

      $httpBackend.flush();
    });
  });
});
