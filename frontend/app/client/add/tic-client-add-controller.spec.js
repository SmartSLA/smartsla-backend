'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('the ticClientAddController', function() {

  var $rootScope, $scope, $controller, $q, $state, ticNotificationFactory, ticClientApiService, ticClientLogoService, form;

  beforeEach(function() {
    $state = {
      go: sinon.spy()
    };

    form = {
      $invalid: false
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
      getClientLogo: angular.noop
    };

    angular.mock.module('linagora.esn.ticketing', function($provide) {
      $provide.value('ticClientApiService', ticClientApiService);
      $provide.value('ticNotificationFactory', ticNotificationFactory);
      $provide.value('ticClientLogoService', ticClientLogoService);
      $provide.value('$state', $state);
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

      expect(ticClientApiService.createClient).to.have.been.calledWith(ctrl.client);
      expect($state.go).to.have.been.calledWith('ticketing.home');
      expect(ticNotificationFactory.weakInfo).to.have.been.calledWith('Success', 'Client Created');
    });

    it('should save client with logo', function() {
      var ctrl = initController();
      var result = [{response: {data: {_id: 'test'}}}];
      var avatarUploader = {
        start: sinon.spy(),
        await: sinon.spy(function(done) {
          done(result);
        })
      };

      ctrl.client = {name: 'Test'};
      ctrl.client.avatarUploader = avatarUploader;

      ctrl.createClient();
      $rootScope.$digest();

      expect(avatarUploader.start).to.have.been.calledWith;
      expect(avatarUploader.await).to.have.been.called;
      expect(ctrl.client.avatarUploader).to.be.undefined;
      expect(ticClientApiService.createClient).to.be.calledWith({ name: 'Test', logo: 'test' });
      expect(ctrl.client.logo).to.equals('test');
      expect($state.go).to.have.been.calledWith('ticketing.home');
      expect(ticNotificationFactory.weakInfo).to.have.been.calledWith('Success', 'Client Created');
    });

    it('should fire notification when client is not saved', function() {
      var ctrl = initController();
      var errorMsg = 'err message';
      var avatarUploader = {
        start: sinon.spy(),
        await: sinon.spy(function(data, err) {
          err({message: errorMsg});
        })
      };

      ctrl.client.avatarUploader = avatarUploader;
      $rootScope.$digest();

      ctrl.createClient();

      expect(ticNotificationFactory.weakInfo).to.not.have.been.called;
      expect(ticNotificationFactory.weakError).to.have.been.calledWith('Error', errorMsg);
      expect(ticClientApiService.createClient).to.not.have.been.called;
    });
  });
});
