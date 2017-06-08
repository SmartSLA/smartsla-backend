'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('the ticClientAddController', function() {

  var $rootScope, $scope, $controller, $q, $state, ticNotificationFactory, ticClientApiService, ticClientLogoService, form;

  beforeEach(function() {
    form = {
      $invalid: false
    };

    $state = {
      go: sinon.spy()
    };

    ticClientApiService = {
      createClient: sinon.spy(function() {
        return $q.when();
      })
    };

    ticNotificationFactory = {
      weakError: sinon.spy(),
      weakInfo: sinon.spy()
    };

    ticClientLogoService = {
      getClientLogo: angular.noop,
      handleLogoUpload: sinon.spy(function(client) {
        return $q.when(client);
      })
    };

    angular.mock.module('linagora.esn.ticketing', function($provide) {
      $provide.value('$state', $state);
      $provide.value('ticClientApiService', ticClientApiService);
      $provide.value('ticNotificationFactory', ticNotificationFactory);
      $provide.value('ticClientLogoService', ticClientLogoService);
    });

    angular.mock.inject(function(_$rootScope_, _$controller_, _$q_, _$state_, _ticClientApiService_, _ticNotificationFactory_, _ticClientLogoService_) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $q = _$q_;
      $controller = _$controller_;
      $state = _$state_;
      ticClientApiService = _ticClientApiService_;
      ticNotificationFactory = _ticNotificationFactory_;
      ticClientLogoService = _ticClientLogoService_;
    });
  });

  function initController() {
    var bindings = {
        form: form
      },
      controller = $controller('ticClientAddController',
        {
          $scope: $scope
        },
        bindings);

    $scope.$digest();

    return controller;
  }

  describe('the createClient method', function() {
    it('should set client.is_active on init', function() {
      var ctrl = initController();

      ctrl.createClient();

      expect(ctrl.client.is_active).to.be.true;
    });

    it('should notify user when the form is invalid', function() {
      form.$invalid = true;
      var ctrl = initController();

      ctrl.createClient();

      expect(ticNotificationFactory.weakError).to.have.been.calledWith('Error', 'Client is not valid');
    });

    it('should save client without logo', function() {
      var ctrl = initController();

      ctrl.client = { name: 'Test' };

      ctrl.createClient();
      $rootScope.$digest();

      expect(ticClientLogoService.handleLogoUpload).to.have.been.calledWith(ctrl.client);
      expect(ticClientApiService.createClient).to.have.been.calledWith(ctrl.client);
      expect($state.go).to.have.been.calledWith;
      expect(ticNotificationFactory.weakInfo).to.have.been.calledWith('Success', 'Client Created');
    });

    it('should save client with logo', function() {
      ticClientLogoService.handleLogoUpload = sinon.spy(function(client) {
        client.logo = 'testLogoId';

        return $q.when(client);
      });
      var ctrl = initController();

      ctrl.client = {name: 'Test'};

      ctrl.createClient();
      $rootScope.$digest();

      expect(ticClientLogoService.handleLogoUpload).to.have.been.called;
      expect(ticClientApiService.createClient).to.be.calledWith({ name: 'Test', logo: 'testLogoId' });
      expect($state.go).to.have.been.calledWith;
      expect(ticNotificationFactory.weakInfo).to.have.been.calledWith('Success', 'Client Created');
    });

    it('should fire notification when ticClientLogoService.handleLogoUpload reject', function() {
      var errorMsg = 'err message';

      ticClientLogoService.handleLogoUpload = sinon.spy(function() {
        return $q.reject({ data: { error: { message: errorMsg } } });
      });
      var ctrl = initController();

      ctrl.createClient();
      $rootScope.$digest();

      expect(ticClientLogoService.handleLogoUpload).to.have.been.calledWith(ctrl.client);
      expect(ticClientApiService.createClient).to.not.have.been.called;
      expect(ticNotificationFactory.weakInfo).to.not.have.been.called;
      expect(ticNotificationFactory.weakError).to.have.been.calledWith('Error', errorMsg);
    });

    it('should fire notification when ticClientApiService.createClient reject', function() {
      var errorMsg = 'err message';

      ticClientApiService.createClient = sinon.spy(function() {
        return $q.reject({ data: { error: { message: errorMsg } } });
      });
      var ctrl = initController();

      ctrl.createClient();
      $rootScope.$digest();

      expect(ticClientLogoService.handleLogoUpload).to.have.been.calledWith(ctrl.client);
      expect(ticClientApiService.createClient).to.have.been.called;
      expect(ticNotificationFactory.weakInfo).to.not.have.been.called;
      expect(ticNotificationFactory.weakError).to.have.been.calledWith('Error', errorMsg);
    });
  });
});
