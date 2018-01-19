'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingOrganizationCreateController', function() {
  var $rootScope, $controller;
  var TicketingOrganizationService;

  beforeEach(function() {
    module('linagora.esn.ticketing');
  });

  beforeEach(function() {
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

    var controller = $controller('TicketingOrganizationCreateController', { $scope: scope, parent: {} });

    scope.$digest();

    return controller;
  }

  describe('The create function', function() {
    it('should call TicketingOrganizationCreateController.create to create organization', function() {
      TicketingOrganizationService.create = sinon.spy();

      var organization = {};
      var controller = initController();

      controller.organization = organization;
      controller.create();
      $rootScope.$digest();

      expect(TicketingOrganizationService.create).to.have.been.calledWith(organization);
    });
  });
});
