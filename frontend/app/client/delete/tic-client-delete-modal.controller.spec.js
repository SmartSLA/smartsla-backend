'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('the ticClientDeleteModalController', function() {

  var $rootScope, $scope, $controller, $q, $state, ticNotificationFactory, ticClientApiService;

  beforeEach(function() {
    $state = {
      go: sinon.spy()
    };

    ticClientApiService = {
      deleteClient: sinon.spy(function() {
        return $q.when();
      })
    };

    ticNotificationFactory = {
      weakError: sinon.spy(),
      weakInfo: sinon.spy()
    };

    angular.mock.module('linagora.esn.ticketing', function($provide) {
      $provide.value('ticClientApiService', ticClientApiService);
      $provide.value('ticNotificationFactory', ticNotificationFactory);
      $provide.value('$state', $state);
    });

    angular.mock.inject(function(_$rootScope_, _$controller_, _$q_, _$state_, _ticClientApiService_, _ticNotificationFactory_) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $q = _$q_;
      $controller = _$controller_;
      $state = _$state_;
      ticClientApiService = _ticClientApiService_;
      ticNotificationFactory = _ticNotificationFactory_;
    });
  });

  function initController() {
    var controller = $controller('ticClientDeleteModalController', {
      $scope: $scope
    });

    $scope.client = {
      _id: '2'
    };
    $scope.$digest();

    return controller;
  }

  describe('the deleteClient method', function() {

    it('should call the ticClientApiService.deleteClient method and call the ticNotificationFactory.weakInfo method', function() {
      initController().deleteClient($scope.client._id);
      $rootScope.$digest();

      expect(ticClientApiService.deleteClient).to.have.been.called;
      expect($state.go).to.have.been.calledWith('ticketing.clients-list');
      expect(ticNotificationFactory.weakInfo).to.have.been.calledWith('Success', 'Client Deleted');
      expect(ticNotificationFactory.weakError).to.not.have.been.called;
    });

    it('should call the ticNotificationFactory.weakError method when ticClientApiService.deleteClient call rejects', function() {
      var error = {};

      ticClientApiService.deleteClient = sinon.spy(function() {
        return $q.reject(error);
      });

      initController().deleteClient($scope.client._id);
      $rootScope.$digest();

      expect(ticClientApiService.deleteClient).to.have.been.called;
      expect(ticNotificationFactory.weakInfo).to.not.have.been.called;
      expect($state.go).to.not.have.been.called;
      expect(ticNotificationFactory.weakError).to.have.been.calledWith('Error', 'Error while deleting the client');
    });
  });
});
