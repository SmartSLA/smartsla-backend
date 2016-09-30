'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('the ticClientAddController', function() {

  var $rootScope, $scope, $controller, $q, $state, notificationFactory, ticClientApiService;

  beforeEach(function() {
    $state = {
      go: sinon.spy()
    };

    ticClientApiService = {
      createClient: sinon.spy(function() {
        return $q.when();
      })
    };

    notificationFactory = {
      weakError: sinon.spy(),
      weakInfo: sinon.spy()
    };

    angular.mock.module('linagora.esn.ticketing', function($provide) {
      $provide.value('ticClientApiService', ticClientApiService);
      $provide.value('notificationFactory', notificationFactory);
      $provide.value('$state', $state);
    });

    angular.mock.inject(function(_$rootScope_, _$controller_, _$q_, _$state_, _ticClientApiService_, _notificationFactory_) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $q = _$q_;
      $controller = _$controller_;
      $state = _$state_;
      ticClientApiService = _ticClientApiService_;
      notificationFactory = _notificationFactory_;
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
      expect(notificationFactory.weakInfo).to.have.been.calledWith('Success', 'Client Created');
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
      expect(notificationFactory.weakInfo).to.have.been.calledWith('Success', 'Client Created');
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

      expect(notificationFactory.weakInfo).to.not.have.been.called;
      expect(notificationFactory.weakError).to.have.been.calledWith('Error', 'Error ' + errorMsg);
      expect(ticClientApiService.createClient).to.not.have.been.called;
    });
  });

});
