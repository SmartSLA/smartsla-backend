'use strict';

describe('The TicketingTicketClient service', function() {
  var API_PATH = '/ticketing/api/tickets';
  var $httpBackend;
  var TicketingTicketClient, ticketId;

  beforeEach(module('linagora.esn.ticketing'));

  beforeEach(function() {
    ticketId = '123';
  });

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

  describe('The list function', function() {
    it('should get to right endpoint to list tickets', function() {
      var options = {};

      $httpBackend.expectGET(API_PATH).respond(200, []);

      TicketingTicketClient.list(options);

      $httpBackend.flush();
    });
  });

  describe('The get function', function() {
    it('should GET to right endpoint to get ticket', function() {
      var ticketId = '123';

      $httpBackend.expectGET(API_PATH + '/' + ticketId).respond(200, {});

      TicketingTicketClient.get(ticketId);

      $httpBackend.flush();
    });
  });

  describe('The update function', function() {
    it('should POST to right endpoint to update basic info of ticket', function() {
      var updateData = { foo: 'baz' };

      $httpBackend.expectPOST(API_PATH + '/' + ticketId, updateData).respond(200, {});

      TicketingTicketClient.update(ticketId, updateData);
      $httpBackend.flush();
    });
  });

  describe('The updateState function', function() {
    it('should POST to right endpoint to update state of ticket', function() {
      var newState = 'In progress';

      $httpBackend.expectPOST(API_PATH + '/' + ticketId, newState).respond(200, {});

      TicketingTicketClient.update(ticketId, newState);
      $httpBackend.flush();
    });
  });

  describe('The setWorkaroundTime function', function() {
    it('should POST to right endpoint to set workaround time of ticket', function() {
      $httpBackend.expectPOST(API_PATH + '/' + ticketId + '?action=set&field=workaroundTime').respond(200, {});

      TicketingTicketClient.setWorkaroundTime(ticketId);
      $httpBackend.flush();
    });
  });

  describe('The unsetWorkaroundTime function', function() {
    it('should POST to right endpoint to unset workaround time of ticket', function() {
      $httpBackend.expectPOST(API_PATH + '/' + ticketId + '?action=unset&field=workaroundTime').respond(200, {});

      TicketingTicketClient.unsetWorkaroundTime(ticketId);
      $httpBackend.flush();
    });
  });

  describe('The setCorrectionTime function', function() {
    it('should POST to right endpoint to set correction time of ticket', function() {
      $httpBackend.expectPOST(API_PATH + '/' + ticketId + '?action=set&field=correctionTime').respond(200, {});

      TicketingTicketClient.setCorrectionTime(ticketId);
      $httpBackend.flush();
    });
  });

  describe('The unsetCorrectionTime function', function() {
    it('should POST to right endpoint to unset correction time of ticket', function() {
      $httpBackend.expectPOST(API_PATH + '/' + ticketId + '?action=unset&field=correctionTime').respond(200, {});

      TicketingTicketClient.unsetCorrectionTime(ticketId);
      $httpBackend.flush();
    });
  });
});
