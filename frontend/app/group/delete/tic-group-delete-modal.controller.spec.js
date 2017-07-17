'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('the ticGroupDeleteModalController', function() {

  var $rootScope, $controller, $q, $scope, $stateParams, $state, ticNotificationFactory, ticGroupApiService, ticClientApiService, clientData;

  beforeEach(function() {
    $stateParams = {
      client: {
        _id: '123',
        name: 'client',
        groups: [{ _id: '123' }]
      },
      clientId: '123'
    };

    $state = {
      go: sinon.spy()
    };

    ticGroupApiService = {
      deleteGroup: sinon.spy(function() {
        return $q.when();
      })
    };

    clientData = { data: { name: 'getClientData' } };

    ticClientApiService = {
      getClient: sinon.spy(function() {
        return $q.when(clientData);
      })
    };

    ticNotificationFactory = {
      weakError: sinon.spy(),
      weakInfo: sinon.spy()
    };

    angular.mock.module('linagora.esn.ticketing', function($provide) {
      $provide.value('$state', $state);
      $provide.value('$stateParams', $stateParams);
      $provide.value('ticGroupApiService', ticGroupApiService);
      $provide.value('ticClientApiService', ticClientApiService);
      $provide.value('ticNotificationFactory', ticNotificationFactory);
    });

    angular.mock.inject(function(_$rootScope_, _$controller_, _$q_, _$state_, _ticGroupApiService_, _ticNotificationFactory_) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $q = _$q_;
      $state = _$state_;
      ticGroupApiService = _ticGroupApiService_;
      ticNotificationFactory = _ticNotificationFactory_;
    });
  });

  function initController() {
    var controller = $controller('ticGroupDeleteModalController', {
      $scope: $scope
    });

    $scope.group = { _id: '123' };

    controller.$onInit();

    $scope.$digest();

    return controller;
  }

  describe('the deleteGroup method', function() {
    it('should call ticClientApiService.getClient() with $stateParams.clientId when $stateParams.client is not available', function() {
      delete $stateParams.client;

      initController();

      expect(ticClientApiService.getClient).to.have.been.calledWith($stateParams.clientId);
    });

    it('should not call ticClientApiService.getClient() when $stateParams.client exists', function() {
      delete $stateParams.clientId;

      initController();

      $rootScope.$digest();

      expect(ticClientApiService.getClient).to.not.have.been.called;
    });

    it('should call ticGroupApiService.deleteGroup() when group._id exists and remove it from client Groups', function() {
      var ctrl = initController();

      ctrl.deleteGroup($scope.group);
      $rootScope.$digest();

      expect(ticGroupApiService.deleteGroup).to.have.been.calledWith($scope.group._id);
      expect($state.go).to.have.been.calledWith();
      expect(ctrl.client.groups).to.be.an('array').that.is.empty;
    });

    it('should not call ticGroupApiService.deleteGroup() when group._id not exists but remove group from client Groups', function() {
      var ctrl = initController(), group = {};

      ctrl.client.groups.push(group);
      ctrl.deleteGroup(group);
      $rootScope.$digest();

      expect(ticGroupApiService.deleteGroup).to.not.have.been.called;
      expect(ctrl.client.groups).to.be.an('array').that.not.includes(group);
      expect($state.go).to.have.been.calledWith();
      expect(ticNotificationFactory.weakInfo).to.have.been.calledWith('Success', 'Group deleted');
    });
  });
});
