'use stric';

/* global chai: false */

var expect = chai.expect;

describe('The TicketingTicketFormController', function() {
  var $rootScope, $controller;
  var contract;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(
      _$rootScope_,
      _$controller_
    ) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
    });

    contract = {
      demands: [{
        demandType: 'demandType1',
        softwareType: 'softwareType1',
        issueType: 'issueType1'
      }, {
        demandType: 'demandType2',
        softwareType: 'softwareType2',
        issueType: 'issueType2'
      }],
      software: [{
        template: {
          _id: 'softwareId',
          name: 'software'
        },
        versions: ['1', '2', '3'],
        type: 'softwareType2'
      }]
    };
  });

  function initController() {
    var $scope = $rootScope.$new();

    var controller = $controller('TicketingTicketFormController', { $scope: $scope });

    controller.$onInit();
    $scope.$digest();

    return controller;
  }

  describe('The onContractChange function', function() {
    it('should set availableDemandTypes array to empty if there is no contract', function() {
      var controller = initController();

      controller.onContractChange();

      expect(controller.availableDemandTypes.length).to.equal(0);
      expect(controller.ticket).to.deep.equal({ contract: null });
      expect(controller.software).to.be.null;
    });

    it('should build availableDemandTypes when contract is provided', function() {
      var controller = initController();

      controller.contracts = [contract];
      controller.onContractChange();

      expect(controller.availableDemandTypes).to.deep.equal([contract.demands[0].demandType, contract.demands[1].demandType]);
      expect(controller.ticket).to.deep.equal({ contract: contract });
      expect(controller.software).to.be.null;
    });
  });

  describe('The onDemandTypeChange function', function() {
    it('should set availableSeverities array to empty if there is no ticket\'s demandType', function() {
      var controller = initController();

      controller.ticket = {
        contract: contract
      };
      controller.onDemandTypeChange();

      expect(controller.availableSeverities.length).to.equal(0);
      expect(controller.ticket).to.deep.equal({
        contract: contract
      });
      expect(controller.software).to.be.null;
    });

    it('should build availableSeverities when ticket\'s demandType is provided', function() {
      var controller = initController();

      controller.ticket = {
        contract: contract,
        demandType: contract.demands[0].demandType
      };
      controller.onDemandTypeChange();

      expect(controller.availableSeverities).to.deep.equal([contract.demands[0].issueType]);
      expect(controller.ticket).to.deep.equal({
        contract: contract,
        demandType: contract.demands[0].demandType
      });
      expect(controller.software).to.be.null;
    });
  });

  describe('The onServerityChange function', function() {
    it('should set availableSoftware array to empty if there is no ticket\'s severity', function() {
      var controller = initController();

      controller.ticket = {
        contract: contract,
        demandType: contract.demands[1].demandType
      };
      controller.onServerityChange();

      expect(controller.availableSoftware.length).to.equal(0);
      expect(controller.ticket).to.deep.equal({
        contract: contract,
        demandType: contract.demands[1].demandType
      });
      expect(controller.software).to.be.null;
    });

    it('should build availableSoftware when ticket\'s severity is provided', function() {
      var controller = initController();

      controller.ticket = {
        contract: contract,
        demandType: contract.demands[1].demandType,
        severity: contract.demands[1].issueType
      };
      controller.onServerityChange();

      expect(controller.availableSoftware).to.deep.equal([{
        type: contract.demands[1].softwareType,
        template: contract.software[0].template._id,
        versions: contract.software[0].versions,
        label: contract.software[0].template.name + ' - (' + contract.software[0].type + ')'
      }]);

      expect(controller.ticket).to.deep.equal({
        contract: contract,
        demandType: contract.demands[1].demandType,
        severity: contract.demands[1].issueType
      });
      expect(controller.software).to.be.null;
    });
  });

  describe('The onSoftwareChange function', function() {
    it('should build availableSoftwareVersions when software change', function() {
      var controller = initController();

      controller.ticket = {
        contract: contract,
        demandType: contract.demands[1].demandType,
        severity: contract.demands[1].issueType
      };

      var availableSoftware = [{
        type: contract.demands[1].softwareType,
        template: contract.software[0].template._id,
        versions: contract.software[0].versions,
        label: contract.software[0].template.name + ' - (' + contract.software[0].type + ')'
      }];

      controller.software = availableSoftware[0];
      controller.onSoftwareChange();

      expect(controller.availableSoftwareVersions).to.deep.equal(contract.software[0].versions);
      expect(controller.ticket).to.deep.equal({
        contract: contract,
        demandType: contract.demands[1].demandType,
        severity: contract.demands[1].issueType,
        software: {
          template: contract.software[0].template._id,
          criticality: contract.software[0].type
        }
      });
    });
  });
});
