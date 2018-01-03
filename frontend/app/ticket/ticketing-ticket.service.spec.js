'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingTicketService', function() {
  var $rootScope, TicketingTicketClient, TicketingTicketService;
  var TICKETING_TICKET_EVENTS;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(
      _$controller_,
      _$rootScope_,
      _TicketingTicketClient_,
      _TicketingTicketService_,
      _TICKETING_TICKET_EVENTS_
    ) {
      $rootScope = _$rootScope_;
      TicketingTicketClient = _TicketingTicketClient_;
      TicketingTicketService = _TicketingTicketService_;
      TICKETING_TICKET_EVENTS = _TICKETING_TICKET_EVENTS_;
    });
  });

  describe('The create function', function() {
    it('should reject if there is no ticket is provided', function(done) {
      TicketingTicketService.create()
        .catch(function(err) {
          expect(err.message).to.equal('Ticket is required');
          done();
        });
      $rootScope.$digest();
    });

    it('should reject if failed to create ticket', function() {
      var ticket = { foo: 'bar' };

      TicketingTicketClient.create = sinon.stub().returns($q.reject());
      TicketingTicketService.create(ticket);
      $rootScope.$digest();

      expect(TicketingTicketClient.create).to.have.been.calledWith(ticket);
    });

    it('should fire an event if success to create ticket', function() {
      var ticket = { foo: 'bar' };

      TicketingTicketClient.create = sinon.stub().returns($q.when({ data: ticket }));
      $rootScope.$broadcast = sinon.spy();
      TicketingTicketService.create(ticket);
      $rootScope.$digest();

      expect(TicketingTicketClient.create).to.have.been.calledWith(ticket);
      expect($rootScope.$broadcast).to.have.been.calledWith(TICKETING_TICKET_EVENTS.CREATED, ticket);
    });
  });
});
