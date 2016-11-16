'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('the ticClientFormController', function() {

  var $rootscope, $scope, $q, $controller, ticClientLogoService;

  beforeEach(function() {
    ticClientLogoService = {
      getClientLogo: sinon.spy(function() {
        return $q.when();
      })
    };

    angular.mock.module('linagora.esn.ticketing', function($provide) {
      $provide.value('ticClientLogoService', ticClientLogoService);
    });

    angular.mock.inject(function(_$rootScope_, _$controller_, _$q_, _ticClientLogoService_) {
      $rootscope = _$rootScope_;
      $scope = $rootscope.$new();
      $controller = _$controller_;
      $q = _$q_;
      ticClientLogoService = _ticClientLogoService_;
    });
  });

  function initController(bindings) {
    bindings = bindings || {
        client: { name: 'Test' },
        formName: 'formName'
    };
    var controller = $controller('ticClientFormController',
      { $scope: $scope },
      bindings
    );

    $scope.$digest();

    return controller;
  }

  describe('the controller initialization', function() {
    it('should initialize scope client variable with controller client variable', function() {
      var ctrl = initController();

      expect($scope.client).to.equal(ctrl.client);
    });

    it('should set formName to "form" when not defined', function() {
      var bindings = {
        client: { name: 'Test' }
      },
      ctrl = initController(bindings);

      expect(ctrl.formName).to.equal('form');
    });
  });

  describe('the getClientLogo function', function() {
    it('should call ticClientLogoService.getClientLogo method', function() {
      var ctrl = initController();
      var client = {};

      ctrl.getClientLogo(client);

      expect(ticClientLogoService.getClientLogo).to.have.been.calledWith(client);
    });
  });
});
