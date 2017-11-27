'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingSoftwareListController', function() {
  var $controller, $rootScope;
  var $modalMock, infiniteScrollHelperMock;
  var TICKETING_SOFTWARE_EVENTS;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    infiniteScrollHelperMock = sinon.spy();
    $modalMock = {};

    angular.mock.module(function($provide) {
      $provide.value('infiniteScrollHelper', infiniteScrollHelperMock);
      $provide.value('$modal', $modalMock);
    });

    inject(function(
      _$controller_,
      _$rootScope_,
      _TICKETING_SOFTWARE_EVENTS_
    ) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      TICKETING_SOFTWARE_EVENTS = _TICKETING_SOFTWARE_EVENTS_;
    });
  });

  function initController($scope, options) {
    $scope = $scope || $rootScope.$new();
    var controller = $controller('TicketingSoftwareListController', { $scope: $scope }, options);

    $scope.$digest();
    controller.$onInit();

    return controller;
  }

  it('should call infiniteScrollHelper to load elements', function() {
    initController();

    expect(infiniteScrollHelperMock).to.have.been.called;
  });

  it('should add the new software at the top of list when software created event is fired', function() {
    var elements = [{ foo: 'bar' }];
    var newSoftware = { baz: 'foo' };
    var controller = initController(null, { elements: elements });

    $rootScope.$broadcast(TICKETING_SOFTWARE_EVENTS.CREATED, newSoftware);

    $rootScope.$digest();

    expect(controller.elements.length).to.equal(2);
    expect(controller.elements[0]).to.deep.equal(newSoftware);
  });
});
