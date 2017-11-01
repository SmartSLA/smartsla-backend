'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingUserUpdateController', function() {
  var $rootScope, $controller;
  var TicketingUserService;

  beforeEach(function() {
    module('linagora.esn.ticketing');

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

  function initController(locals) {
    return $controller('TicketingUserUpdateController', locals || {});
  }

  describe('The update function', function() {
    it('should call TicketingUserService.update to update user', function() {
      TicketingUserService.update = sinon.spy();

      var user = { _id: '123', main_phone: '888', description: 'desc' };
      var controller = initController({ user: user });

      controller.update();
      $rootScope.$digest();

      expect(TicketingUserService.update).to.have.been.calledWith(user);
    });
  });
});
