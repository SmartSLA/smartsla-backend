'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The TicketingDemandTimeController', function() {
  var $controller, $rootScope, $scope;
  var TICKETING_CONTRACT_EVENTS, TICKETING_TIME_AVAILABLE_UNITS;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(
      _$controller_,
      _$rootScope_,
      _TICKETING_CONTRACT_EVENTS_,
      _TICKETING_TIME_AVAILABLE_UNITS_
    ) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      TICKETING_CONTRACT_EVENTS = _TICKETING_CONTRACT_EVENTS_;
      TICKETING_TIME_AVAILABLE_UNITS = _TICKETING_TIME_AVAILABLE_UNITS_;
    });
  });

  function initController(scope, options) {
    options = options || {};
    $scope = scope || $rootScope.$new();
    var controller = $controller('TicketingDemandTimeController', { $scope: $scope }, options);

    $scope.$digest();
    controller.$onInit();

    return controller;
  }

  it('should refresh time when demand added event is fired', function() {
    var contract = {
      demands: [{ foo: 'foz' }]
    };
    var demandToAdd = { bar: 'baz' };
    var controller = initController(null, { contract: contract });

    $rootScope.$broadcast(TICKETING_CONTRACT_EVENTS.DEMAND_ADDED, demandToAdd);

    expect(controller.value).to.be.null;
    expect(controller.unit).to.deep.equal(TICKETING_TIME_AVAILABLE_UNITS[0]);
  });
});
