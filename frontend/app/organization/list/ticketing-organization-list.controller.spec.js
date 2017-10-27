'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingOrganizationListController', function() {
  var $rootScope, $controller, $scope;
  var $modalMock, infiniteScrollHelperMock;
  var organizations;
  var TICKETING_ORGANIZATION_EVENTS;

  beforeEach(function() {
    infiniteScrollHelperMock = sinon.spy();
    organizations = [{ foo: 'bar' }];
    $modalMock = {};

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
      _TICKETING_ORGANIZATION_EVENTS_
    ) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      TICKETING_ORGANIZATION_EVENTS = _TICKETING_ORGANIZATION_EVENTS_;
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

  it('should push the new organization on top of list when organization created event fire', function() {
    var organization = { baz: 'abc' };
    var expectGroups = angular.copy(organizations);

    expectGroups.unshift(organization);
    var controller = initController();

    $scope.$on = sinon.stub();
    $rootScope.$broadcast(TICKETING_ORGANIZATION_EVENTS.ORGANIZATION_CREATED, organization);

    expect(controller.elements).to.deep.equal(expectGroups);
  });
});
