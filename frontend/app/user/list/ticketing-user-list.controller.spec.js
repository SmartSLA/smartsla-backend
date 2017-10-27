'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingUserListController', function() {
  var $rootScope, $controller, $scope;
  var infiniteScrollHelperMock;
  var users;

  beforeEach(function() {
    infiniteScrollHelperMock = sinon.spy();
    users = [{ foo: 'bar' }];

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

    var controller = $controller('TicketingUserListController', { $scope: $scope }, { elements: users });

    controller.$onInit();
    $scope.$digest();

    return controller;
  }

  it('should call infiniteScrollHelper to load elements', function() {
    initController();

    expect(infiniteScrollHelperMock).to.have.been.called;
  });
});
