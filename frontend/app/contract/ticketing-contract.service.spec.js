'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingContractService', function() {
  var $rootScope, TicketingContractService, ticketingContractClient;
  var TICKETING_CONTRACT_EVENTS;

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
  });

  describe('The addDemand function', function() {
    var contract;

    beforeEach(function() {
      ticketingContractClient.addDemand = sinon.spy();

      contract = {
        _id: 'contractId',
        demands: [
          { demandType: 'demandType1' }
        ]
      };
    });

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

      $rootScope.$broadcast = sinon.spy();
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

  describe('The updateSoftware function', function() {
    var contractId;

    beforeEach(function() {
      contractId = '1234';
      ticketingContractClient.updateSoftware = sinon.spy();
    });

    it('should reject if there is no contractId is provided', function(done) {
      TicketingContractService.updateSoftware()
        .catch(function(err) {
          expect(err.message).to.equal('contractId is required');
          expect(ticketingContractClient.updateSoftware).to.not.have.been.called;
          done();
        });

      $rootScope.$digest();
    });

    it('should reject if there is no software is provided', function(done) {
      TicketingContractService.updateSoftware(contractId)
        .catch(function(err) {
          expect(err.message).to.equal('software is required');
          expect(ticketingContractClient.updateSoftware).to.not.have.been.called;
          done();
        });

      $rootScope.$digest();
    });

    it('should reject if there is no software template is provided', function(done) {
      TicketingContractService.updateSoftware(contractId, {})
        .catch(function(err) {
          expect(err.message).to.equal('Software template and its ID are required');
          expect(ticketingContractClient.updateSoftware).to.not.have.been.called;
          done();
        });

      $rootScope.$digest();
    });

    it('should reject if there is no ID of software template is provided', function(done) {
      TicketingContractService.updateSoftware(contractId, { template: {} })
        .catch(function(err) {
          expect(err.message).to.equal('Software template and its ID are required');
          expect(ticketingContractClient.updateSoftware).to.not.have.been.called;
          done();
        });

      $rootScope.$digest();
    });

    it('should reject if failed to update software', function(done) {
      var error = new Error('something wrong');
      var software = {
        template: { _id: '5678' },
        versions: ['1']
      };

      ticketingContractClient.updateSoftware = sinon.stub().returns($q.reject(error));

      TicketingContractService.updateSoftware(contractId, software)
        .catch(function(err) {
          expect(err.message).to.equal(error.message);
          expect(ticketingContractClient.updateSoftware).to.have.been.calledWith(
            contractId,
            software.template._id,
            { versions: software.versions }
          );
          done();
        });

      $rootScope.$digest();
    });

    it('should resolve if success to update software', function(done) {
      var software = {
        template: { _id: '5678' },
        versions: ['1']
      };

      ticketingContractClient.updateSoftware = sinon.stub().returns($q.when());
      $rootScope.$broadcast = sinon.spy();

      TicketingContractService.updateSoftware(contractId, software)
        .then(function() {
          expect(ticketingContractClient.updateSoftware).to.have.been.calledWith(
            contractId,
            software.template._id,
            { versions: software.versions }
          );
          expect($rootScope.$broadcast).to.have.been.calledWith(TICKETING_CONTRACT_EVENTS.SOFTWARE_UPDATED, software);
          done();
        })
        .catch(function(err) {
          done(err || 'should resolve');
        });

      $rootScope.$digest();
    });
  });
});
