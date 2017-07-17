'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('the ticClientViewController', function() {

  var $rootScope, $scope, $controller, $stateParams, $q, ticClientLogoService, ticClientApiService;

  beforeEach(function() {

    ticClientApiService = {
      getClient: sinon.spy(function() {
        return $q.when();
      })
    };

    ticClientLogoService = {
      getClientLogo: sinon.spy(function() {
        return $q.when();
      })
    };

    $stateParams = {
      clientId: '1'
    };

    angular.mock.module('linagora.esn.ticketing', function($provide) {
      $provide.value('ticClientApiService', ticClientApiService);
      $provide.value('ticClientLogoService', ticClientLogoService);
      $provide.value('$stateParams', $stateParams);
    });

    angular.mock.inject(function(_$rootScope_, _$controller_, _$stateParams_, _$q_, _ticClientApiService_, _ticClientLogoService_) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $q = _$q_;
      $controller = _$controller_;
      $stateParams = _$stateParams_;
      ticClientApiService = _ticClientApiService_;
      ticClientLogoService = _ticClientLogoService_;
    });
  });

  function initController() {
    var controller = $controller('ticClientViewController', {
      $scope: $scope
    });

    controller.$onInit();

    return controller;
  }

  describe('the getClientLogo method', function() {
    it('should expose ticClientLogoService.getClientLogo method', function() {
      var ctrl = initController();
      var client = {
          name: 'Linagora',
          address: 'Ghazela'
        };

        ctrl.getClientLogo(client);

        expect(ticClientLogoService.getClientLogo).to.have.been.calledWith(client);
    });
  });

  describe('the initialization', function() {
    it('should init ctrl.client from stateParams.client if it exists', function() {
      $stateParams.client = { _id: 'id' };
       var ctrl = initController();

      expect(ctrl.client).to.equal($stateParams.client);
    });

    it('should fetch the client if stateParams.client does not exists', function() {
      var result = {
        data: { _id: 'anId' }
      };

      ticClientApiService.getClient = sinon.spy(function() {
        return $q.when(result);
      });

      var ctrl = initController();

      $rootScope.$digest();
      expect(ticClientApiService.getClient).to.have.been.calledWith($stateParams.clientId);
      expect(ctrl.client).to.equal(result.data);
    });
  });
});
