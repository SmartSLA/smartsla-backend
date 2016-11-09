'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('the ticClientAddController', function() {

  var $rootScope, $scope, $controller, $q, $state, ticNotificationFactory, ticClientApiService, ticClientLogoService;

  beforeEach(function() {
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
    var controller = $controller('ticClientAddController', {
      $scope: $scope
    });

    $scope.client = {};
    $scope.$digest();

    return controller;
  }

  describe('the createClient method', function() {
    it('should do nothing if form is invalid', function() {
      initController().createClient({$invalid: true});

      expect(ticClientApiService.createClient).to.not.have.been.called;
    });

    it('should save client without logo', function() {
      initController().createClient({$invalid: false});
      $rootScope.$digest();

      expect(ticClientApiService.createClient).to.have.been.calledWith($scope.client);
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

      $scope.client.avatarUploader = avatarUploader;

      ctrl.createClient({$invalid: false});
      $rootScope.$digest();

      expect(avatarUploader.start).to.have.been.calledWith;
      expect(avatarUploader.await).to.have.been.called;
      expect($scope.client.avatarUploader).to.be.undefined;
      expect(ticClientApiService.createClient).to.be.calledWith({ logo: 'test' });
      expect($scope.client.logo).to.equals('test');
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

      $scope.client.avatarUploader = avatarUploader;
      $rootScope.$digest();

      ctrl.createClient({$invalid: false});

      expect(ticNotificationFactory.weakInfo).to.not.have.been.called;
      expect(ticNotificationFactory.weakError).to.have.been.calledWith('Error', errorMsg);
      expect(ticClientApiService.createClient).to.not.have.been.called;
    });
  });
});
