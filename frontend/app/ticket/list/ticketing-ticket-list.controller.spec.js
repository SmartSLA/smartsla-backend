'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingTicketListController', function() {
  var $rootScope, $controller, $scope;
  var infiniteScrollHelperMock, $modalMock;
  var TICKETING_TICKET_EVENTS;

  beforeEach(function() {
    infiniteScrollHelperMock = sinon.spy();
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
      _TICKETING_TICKET_EVENTS_
    ) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      TICKETING_TICKET_EVENTS = _TICKETING_TICKET_EVENTS_;
    });
  });

  function initController() {
    $scope = $rootScope.$new();

    var controller = $controller('TicketingTicketListController', { $scope: $scope });

    controller.$onInit();
    $scope.$digest();

    return controller;
  }

  it('should call infiniteScrollHelper to load elements', function() {
    initController();

    expect(infiniteScrollHelperMock).to.have.been.called;
  });

  it('should push the new ticket on top of list when ticket created event fire', function() {
    var ticket = { baz: 'abc' };

    var controller = initController();

    controller.elements = [{ foo: 'foz' }];

    $scope.$on = sinon.stub();
    $rootScope.$broadcast(TICKETING_TICKET_EVENTS.CREATED, ticket);

    expect(controller.elements[0]).to.deep.equal(ticket);
  });
});
