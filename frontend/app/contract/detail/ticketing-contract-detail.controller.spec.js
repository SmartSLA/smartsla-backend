'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The TicketingContractDetailController', function() {
  var $controller, $rootScope, $scope;
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
      _TICKETING_CONTRACT_EVENTS_
    ) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
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
});
