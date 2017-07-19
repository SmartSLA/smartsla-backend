'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('the ticClientsListController', function() {
  var $rootScope, $scope, $controller, $q, ticClientApiService, ticClientLogoService;

  beforeEach(function() {
    ticClientApiService = {
      getClients: sinon.spy(function() {
        return $q.when();
      })
    };

    ticClientLogoService = {
      getClientLogo: sinon.spy(function() {
        return $q.when();
      })
    };

    angular.mock.module('linagora.esn.ticketing', function($provide) {
      $provide.value('ticClientApiService', ticClientApiService);
      $provide.value('ticClientLogoService', ticClientLogoService);
    });

    angular.mock.inject(function(_$rootScope_, _$controller_, _$q_, _ticClientApiService_, _ticClientLogoService_) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $q = _$q_;
      $controller = _$controller_;
      ticClientApiService = _ticClientApiService_;
      ticClientLogoService = _ticClientLogoService_;
    });
  });

  function initController() {
    var controller = $controller('ticClientsListController', {
      $scope: $scope
    });

    controller.$onInit();

    return controller;
  }

  describe('the getClientLogo method', function() {

    it('should call ticClientLogoService.getClientLogo method', function() {
      var ctrl = initController();
      var client = {
        name: 'John',
        address: 'Paris'
      };

      ctrl.getClientLogo(client);

      expect(ticClientLogoService.getClientLogo).to.have.been.calledWith(client);
    });
  });

  describe('the initialization', function() {
    it('should expose clients to the controller', function() {
      var results = {
        data: {}
      };

      ticClientApiService.getClients = sinon.spy(function() {
        return $q.when(results);
      });

      var ctrl = initController();

      $rootScope.$digest();

      expect(ticClientApiService.getClients).to.have.been.calledWith();
      expect(ctrl.clients).to.equal(results.data);
    });
  });
});
