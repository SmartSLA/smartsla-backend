'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingContractDetailController', function() {
  var $controller, $rootScope, $scope;
  var TicketingContractService;
  var $modalMock;
  var TICKETING_CONTRACT_EVENTS;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    $modalMock = {};

    angular.mock.module(function($provide) {
      $provide.value('$modal', $modalMock);
    });

    inject(function(
      _$controller_,
      _$rootScope_,
      _TicketingContractService_,
      _TICKETING_CONTRACT_EVENTS_
    ) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      TicketingContractService = _TicketingContractService_;
      TICKETING_CONTRACT_EVENTS = _TICKETING_CONTRACT_EVENTS_;
    });
  });

  function initController(scope, options) {
    options = options || {};
    $scope = scope || $rootScope.$new();
    var controller = $controller('TicketingContractDetailController', { $scope: $scope }, options);

    $scope.$digest();
    controller.$onInit();

    return controller;
  }

  it('should put the added software to the top of list software when software added event is fired', function() {
    var contract = {
      software: [{ foo: 'foz' }]
    };
    var softwareToAdd = { bar: 'baz' };
    var controller = initController(null, { contract: contract });

    $rootScope.$broadcast(TICKETING_CONTRACT_EVENTS.SOFTWARE_ADDED, softwareToAdd);

    expect(controller.contract.software.length).to.equal(2);
    expect(controller.contract.software[0]).to.deep.equal(softwareToAdd);
  });

  it('should put the added demand to the top of list demands when demand added event is fired', function() {
    var contract = {
      demands: [{ foo: 'foz' }]
    };
    var demandToAdd = { bar: 'baz' };
    var controller = initController(null, { contract: contract });

    $rootScope.$broadcast(TICKETING_CONTRACT_EVENTS.DEMAND_ADDED, demandToAdd);

    expect(controller.contract.demands.length).to.equal(2);
    expect(controller.contract.demands[0]).to.deep.equal(demandToAdd);
  });

  it('should update a correct item after software updated event is fired', function() {
    var contract = {
      software: [
        {
          template: { _id: '123', versions: ['1', '2'] },
          versions: ['1', '2']
        },
        {
          template: { _id: '456', versions: ['3', '4'] },
          versions: '3'
        }
      ]
    };
    var softwareToUpdate = {
      template: contract.software[1].template,
      versions: ['3', '4']
    };
    var controller = initController(null, { contract: contract });

    $rootScope.$broadcast(TICKETING_CONTRACT_EVENTS.SOFTWARE_UPDATED, softwareToUpdate);

    expect(controller.contract.software[1]).to.deep.equal(softwareToUpdate);
  });

  describe('The onAddDemandBtnClick function', function() {
    var contract;

    beforeEach(function() {
      contract = { _id: 'contractId' };
      TicketingContractService.get = function() {
        return $q.when(contract);
      };
    });

    it('should reject if failed to add demand to contract', function(done) {
      var error = new Error('something wrong');
      var newDemand = { foo: 'bar' };
      var controller = initController(null, { contract: contract });

      TicketingContractService.addDemand = sinon.stub().returns($q.reject(error));
      controller.newDemand = newDemand;

      controller.onAddDemandBtnClick()
        .catch(function(err) {
          expect(err.message).to.equal(error.message);
          expect(TicketingContractService.addDemand).to.have.been.calledWith(contract, newDemand);
          done();
        });

      $rootScope.$digest();
    });

    it('should resolve if success to add demand to contract', function(done) {
      var newDemand = { foo: 'bar' };
      var controller = initController(null, { contract: contract });
      var form = {
        $setUntouched: sinon.spy()
      };

      TicketingContractService.addDemand = sinon.stub().returns($q.when());
      controller.newDemand = newDemand;

      controller.onAddDemandBtnClick(form)
        .then(function() {
          expect(TicketingContractService.addDemand).to.have.been.calledWith(contract, newDemand);
          expect(form.$setUntouched).to.have.been.calledOnce;
          expect(controller.newDemand).to.deep.equal({});
          done();
        })
        .catch(function(err) {
          done(err || 'should resolve');
        });

      $rootScope.$digest();
    });
  });
});
