'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('the ticGroupFormController', function() {

  var $rootScope, $scope, $controller, $q, $stateParams, $state, ticNotificationFactory, ticGroupApiService, form;

  beforeEach(function() {
    $state = {
      go: sinon.spy()
    };

    $stateParams = {
      client: {
        _id: '1',
        address: {
          street: 'street'
        },
        preferred_contact: 'linagora'
      }
    };

    form = {
      $invalid: false
    };

    ticGroupApiService = {
      createGroup: sinon.spy(function() {
        return $q.when();
      })
    };

    ticNotificationFactory = {
      weakError: sinon.spy(),
      weakInfo: sinon.spy()
    };

    angular.mock.module('linagora.esn.ticketing', function($provide) {
      $provide.value('$stateParams', $stateParams);
      $provide.value('ticGroupApiService', ticGroupApiService);
      $provide.value('ticNotificationFactory', ticNotificationFactory);
      $provide.value('$state', $state);
    });

    angular.mock.inject(function(_$rootScope_, _$controller_, _$q_, _$stateParams_, _$state_, _ticGroupApiService_, _ticNotificationFactory_) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $q = _$q_;
      $controller = _$controller_;
      $state = _$state_;
      $stateParams = _$stateParams_;
      ticGroupApiService = _ticGroupApiService_;
      ticNotificationFactory = _ticNotificationFactory_;
    });
  });

  function initController() {
    var bindings = {
        form: form
      },
      controller = $controller('ticGroupAddController',
        {
          $scope: $scope
        },
        bindings);

    controller.$onInit();

    $scope.$digest();

    return controller;
  }

  describe('the controller initialization', function() {
    it('should set group.is_active', function() {
      var ctrl = initController();

      expect(ctrl.group.is_active).to.be.true;
    });

    it('should set group.address, group.preferred_contact and group.client with the corresponding client attributes', function() {
      var ctrl = initController();

      expect(ctrl.group.client).to.equals($stateParams.client._id);
      expect(ctrl.group.address).to.equals($stateParams.client.address);
      expect(ctrl.group.preferred_contact).to.equals($stateParams.client.preferred_contact);
    });
  });

  describe('the createGroup method', function() {
    it('should notify user when the form is invalid', function() {
      form.$invalid = true;
      var ctrl = initController();

      ctrl.createGroup();

      expect(ticNotificationFactory.weakError).to.have.been.calledWith('Error', 'Group is not valid');
    });

    it('should save the group in the client', function() {
      var ctrl = initController();

      ctrl.client = { groups: [] };
      ctrl.group = { name: 'linagora' };

      ctrl.createGroup();
      $rootScope.$digest();

      expect(ctrl.client.groups).to.be.deep.equals([{ name: 'linagora' }]);
      expect($state.go).to.have.been.calledWith;
      expect(ticNotificationFactory.weakInfo).to.have.been.calledWith('Success', 'Group added');
    });
  });
});
