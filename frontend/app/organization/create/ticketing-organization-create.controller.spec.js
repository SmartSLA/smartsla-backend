'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingOrganizationCreateController', function() {
  var $rootScope, $controller;
  var TicketingOrganizationService;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(
      _$rootScope_,
      _$controller_,
      _TicketingOrganizationService_
    ) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      TicketingOrganizationService = _TicketingOrganizationService_;
    });
  });

  function initController(scope) {
    scope = scope || $rootScope.$new();

    var controller = $controller('TicketingOrganizationCreateController', { scope: scope });

    scope.$digest();

    return controller;
  }

  describe('The create function', function() {
    it('should call TicketingOrganizationService.create to create organization', function() {
      TicketingOrganizationService.create = sinon.spy();

      var organization = { shortName: 'abc', fullName: 'abc organization' };
      var newAdministrators = [
        { _id: 'user1Id' }
      ];

      var controller = initController();

      controller.organization = organization;
      controller.newAdministrators = newAdministrators;
      controller.create();
      $rootScope.$digest();

      expect(TicketingOrganizationService.create).to.have.been.calledWith(organization, newAdministrators[0]);
    });
  });
});
