'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingUserCreateController', function() {
  var $rootScope, $controller;
  var TicketingUserService;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    angular.mock.module(function($provide) {
      $provide.value('organization', {});
    });
  });

  beforeEach(function() {
    inject(function(
      _$rootScope_,
      _$controller_,
      _TicketingUserService_
    ) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      TicketingUserService = _TicketingUserService_;
    });
  });

  function initController(scope) {
    scope = scope || $rootScope.$new();

    var controller = $controller('TicketingUserCreateController', { scope: scope });

    scope.$digest();

    return controller;
  }

  describe('The create function', function() {
    it('should call TicketingUserService.create to create user', function() {
      TicketingUserService.create = sinon.spy();

      var user = { firstname: 'foo', lastname: 'bar', email: 'foo@tic.org', main_phone: '888' };
      var controller = initController();

      controller.user = user;
      controller.create();
      $rootScope.$digest();

      expect(TicketingUserService.create).to.have.been.calledWith(user);
    });
  });
});
