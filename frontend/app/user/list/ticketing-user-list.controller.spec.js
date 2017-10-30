'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingUserListController', function() {
  var $rootScope, $controller, $scope;
  var $modalMock, infiniteScrollHelperMock;
  var users;
  var TICKETING_USER_EVENTS;

  beforeEach(function() {
    infiniteScrollHelperMock = sinon.spy();
    $modalMock = {};
    users = [{ foo: 'bar' }];

    angular.mock.module(function($provide) {
      $provide.value('infiniteScrollHelper', infiniteScrollHelperMock);
      $provide.value('$modal', $modalMock);
    });
  });

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(
      _$rootScope_,
      _$controller_,
      _TICKETING_USER_EVENTS_
    ) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      TICKETING_USER_EVENTS = _TICKETING_USER_EVENTS_;
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

  it('should push the new user on top of list when user created event fire', function() {
    var user = {
        firstname: 'foo',
        lastname: 'bar',
        email: 'bar@tic.org',
        main_phone: '888'
      };
    var expectUsers = angular.copy(users);

    expectUsers.unshift(user);
    var controller = initController();

    $scope.$on = sinon.stub();
    $rootScope.$broadcast(TICKETING_USER_EVENTS.USER_CREATED, user);

    expect(controller.elements).to.deep.equal(expectUsers);
  });
});
