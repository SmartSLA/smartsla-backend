'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingOrderService', function() {
  var $rootScope;
  var TicketingOrderService, ticketingContractClient;
  var TICKETING_ORDER_EVENTS;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(
      _$rootScope_,
      _TicketingOrderService_,
      _ticketingContractClient_,
      _TICKETING_ORDER_EVENTS_
    ) {
      $rootScope = _$rootScope_;
      TicketingOrderService = _TicketingOrderService_;
      ticketingContractClient = _ticketingContractClient_;
      TICKETING_ORDER_EVENTS = _TICKETING_ORDER_EVENTS_;
    });
  });

  describe('The create function', function() {
    it('should reject if order is not given', function(done) {
      TicketingOrderService.create()
        .catch(function(err) {
          expect(err).to.be.exist;
          expect(err.message).to.equal('order is required');
          done();
        });

      $rootScope.$digest();
    });

    it('should call ticketingContractClient.create to create new order', function(done) {
      var order = {
        title: 'foo',
        startDate: new Date(),
        terminationDate: new Date(),
        contract: 'contract-id'
      };

      ticketingContractClient.createOrder = sinon.stub().returns($q.when({
        data: order
      }));
      $rootScope.$broadcast = sinon.spy();

      TicketingOrderService.create(order)
        .then(function() {
          expect(ticketingContractClient.createOrder).to.have.been.calledWith(order.contract, order);
          expect($rootScope.$broadcast).to.have.been.calledWith(TICKETING_ORDER_EVENTS.ORDER_CREATED, order);
          done();
        })
        .catch(function(err) {
          done(err || 'should resolve');
        });

      $rootScope.$digest();
    });
  });
});
