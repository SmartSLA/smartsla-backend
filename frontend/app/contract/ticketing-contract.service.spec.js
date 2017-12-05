'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingContractService', function() {
  var $rootScope, TicketingContractService, ticketingContractClient;
  var TICKETING_CONTRACT_EVENTS;
  var contract;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(
      _$rootScope_,
      _ticketingContractClient_,
      _TicketingContractService_,
      _TICKETING_CONTRACT_EVENTS_
    ) {
      $rootScope = _$rootScope_;
      ticketingContractClient = _ticketingContractClient_;
      TicketingContractService = _TicketingContractService_;
      TICKETING_CONTRACT_EVENTS = _TICKETING_CONTRACT_EVENTS_;
    });

    ticketingContractClient.addDemand = sinon.spy();
    $rootScope.$broadcast = sinon.spy();

    contract = {
      _id: 'contractId',
      demands: [
        { demandType: 'demandType1' }
      ]
    };
  });

  describe('The addDemand function', function() {
    it('should reject if there is no contract is provided', function(done) {
      TicketingContractService.addDemand()
        .catch(function(err) {
          expect(err.message).to.equal('Contract is required');
          expect(ticketingContractClient.addDemand).to.not.have.been.called;
          done();
        });

      $rootScope.$digest();
    });

    it('should reject if there is no demand is provided', function(done) {
      TicketingContractService.addDemand(contract)
        .catch(function(err) {
          expect(err.message).to.equal('Demand is required');
          expect(ticketingContractClient.addDemand).to.not.have.been.called;
          done();
        });

      $rootScope.$digest();
    });

    it('should reject if there is demand already exists', function(done) {
      var demand = { demandType: contract.demands[0].demandType };

      TicketingContractService.addDemand(contract, demand)
        .catch(function(err) {
          expect(err.message).to.equal('Demand already exists');
          expect(ticketingContractClient.addDemand).to.not.have.been.called;
          done();
        });

      $rootScope.$digest();
    });

    it('should reject if failed to add demand', function(done) {
      var demand = { demandType: 'demandType2' };
      var error = new Error('something wrong');

      ticketingContractClient.addDemand = sinon.stub().returns($q.reject(error));

      TicketingContractService.addDemand(contract, demand)
        .catch(function(err) {
          expect(err.message).to.equal(error.message);
          expect(ticketingContractClient.addDemand).to.have.been.calledWith(contract._id, demand);
          done();
        });

      $rootScope.$digest();
    });

    it('should resolve if success to add demand', function(done) {
      var demand = { demandType: 'demandType2' };

      ticketingContractClient.addDemand = sinon.stub().returns($q.when());

      TicketingContractService.addDemand(contract, demand)
        .then(function() {
          expect(ticketingContractClient.addDemand).to.have.been.calledWith(contract._id, demand);
          expect($rootScope.$broadcast).to.have.been.calledWith(TICKETING_CONTRACT_EVENTS.DEMAND_ADDED, demand);
          done();
        })
        .catch(function(err) {
          done(err || 'should resolve');
        });

      $rootScope.$digest();
    });
  });
});
