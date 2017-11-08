'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingOrderListController', function() {
  var $rootScope, $controller, $scope;
  var infiniteScrollHelperMock;
  var orders;

  beforeEach(function() {
    infiniteScrollHelperMock = sinon.spy();
    orders = [{ foo: 'bar' }];

    angular.mock.module(function($provide) {
      $provide.value('infiniteScrollHelper', infiniteScrollHelperMock);
    });
  });

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(
      _$rootScope_,
      _$controller_
    ) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
    });
  });

  function initController() {
    $scope = $rootScope.$new();

    var controller = $controller('TicketingOrderListController', { $scope: $scope }, { elements: orders });

    controller.$onInit();
    $scope.$digest();

    return controller;
  }

  it('should call infiniteScrollHelper to load elements', function() {
    initController();

    expect(infiniteScrollHelperMock).to.have.been.called;
  });
});
