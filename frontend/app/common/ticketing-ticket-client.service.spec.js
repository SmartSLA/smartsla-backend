'use strict';

describe('The TicketingTicketClient service', function() {
  var API_PATH = '/ticketing/api/tickets';
  var $httpBackend;
  var TicketingTicketClient;

  beforeEach(module('linagora.esn.ticketing'));

  beforeEach(inject(function(_$httpBackend_, _TicketingTicketClient_) {
    $httpBackend = _$httpBackend_;
    TicketingTicketClient = _TicketingTicketClient_;
  }));

  describe('The create function', function() {
    it('should POST to right endpoint to create a new ticket', function() {
      var ticket = { foo: 'baz' };

      $httpBackend.expectPOST(API_PATH, ticket).respond(201, {});

      TicketingTicketClient.create(ticket);
      $httpBackend.flush();
    });
  });
});
