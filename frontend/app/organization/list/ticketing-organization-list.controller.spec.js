'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingOrganizationListController', function() {
  var $rootScope, $controller, $scope;
  var infiniteScrollHelperMock;
  var organizations;

  beforeEach(function() {
    infiniteScrollHelperMock = sinon.spy();
    organizations = [{ foo: 'bar' }];

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

    var controller = $controller('TicketingOrganizationListController', { $scope: $scope }, { elements: organizations });

    controller.$onInit();
    $scope.$digest();

    return controller;
  }

  it('should call infiniteScrollHelper to load elements', function() {
    initController();

    expect(infiniteScrollHelperMock).to.have.been.called;
  });
});
