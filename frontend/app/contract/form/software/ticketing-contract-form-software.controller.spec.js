'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingContractFormSoftwareController', function() {
  var $controller, $rootScope, $scope;
  var TicketingContractService;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(
      _$controller_,
      _$rootScope_,
      _TicketingContractService_
    ) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      TicketingContractService = _TicketingContractService_;
    });
  });

  function initController(scope, options) {
    options = options || {};
    $scope = scope || $rootScope.$new();
    var controller = $controller('TicketingContractFormSoftwareController', { $scope: $scope }, options);

    $scope.$digest();
    controller.$onInit();

    return controller;
  }

  it('should get software available types from contract', function() {
    var contract = {
      demands: [
        { softwareType: 'type1' },
        { softwareType: 'type2' }
      ]
    };
    var controller = initController(null, { contract: contract });

    expect(controller.softwareAvailableTypes.length).to.equal(contract.demands.length);
    expect(controller.softwareAvailableTypes).to.deep.equal(['type1', 'type2']);
  });

  it('should get the list of existing software ids from contract', function() {
    var contract = {
      software: [
        { template: { _id: 'software1' } },
        { template: { _id: 'software2' } }
      ]
    };
    var controller = initController(null, { contract: contract });

    expect(controller.existingSoftwareIds.length).to.equal(contract.software.length);
    expect(controller.existingSoftwareIds).to.deep.equal(['software1', 'software2']);
  });

  describe('The onAddBtnClick function', function() {
    it('should reject if failed to add software', function(done) {
      var error = new Error('something wrong');

      TicketingContractService.addSoftware = sinon.stub().returns($q.reject(error));
      var software = { template: { _id: 'softwareId'} };
      var contract = { _id: 'contractId' };
      var controller = initController(null, { contract: contract });

      controller.software = software;

      controller.onAddBtnClick()
        .catch(function(err) {
          expect(err.message).to.equal('something wrong');
          expect(TicketingContractService.addSoftware).to.have.been.calledWith(contract._id, software);
          done();
        });

      $rootScope.$digest();
    });

    it('should resolve if add software successfully', function(done) {
      var software = { template: { _id: 'softwareId'} };
      var contract = { _id: 'contractId' };
      var controller = initController(null, { contract: contract });
      var form = {};

      form.$setUntouched = sinon.spy();
      TicketingContractService.addSoftware = sinon.stub().returns($q.when());

      controller.software = software;
      controller.onAddBtnClick(form)
        .then(function() {
          expect(form.$setUntouched).to.have.been.calledOnce;
          expect(TicketingContractService.addSoftware).to.have.been.calledWith(contract._id, software);
          done();
        })
        .catch(function(err) {
          done(err || 'should resolve');
        });

      $rootScope.$digest();
    });
  });
});
