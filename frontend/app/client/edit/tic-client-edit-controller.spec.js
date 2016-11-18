'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('the ticClientEditController', function() {

  var $rootScope, $scope, $controller, $q, $stateParams, esnPreviousState, ticNotificationFactory, ticClientApiService, ticClientLogoService, form, clientData;

  beforeEach(function() {
    $stateParams = {
      client: {
        _id: '123',
        name: 'Test'
      },
      clientId: 'Test'
    };

    form = {
      $invalid: false
    };

    clientData = { data: { name: 'TestGetClient' } };

    esnPreviousState = {
      go: sinon.spy()
    };

    ticClientApiService = {
      getClient: sinon.spy(function() {
        return $q.when(clientData);
      }),
      updateClient: sinon.spy(function() {
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
      $provide.value('$stateParams', $stateParams);
      $provide.value('esnPreviousState', esnPreviousState);
      $provide.value('ticClientApiService', ticClientApiService);
      $provide.value('ticNotificationFactory', ticNotificationFactory);
      $provide.value('ticClientLogoService', ticClientLogoService);
    });

    angular.mock.inject(function(_$rootScope_, _$controller_, _$q_, _$stateParams_, _esnPreviousState_, _ticClientApiService_, _ticNotificationFactory_, _ticClientLogoService_) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $q = _$q_;
      $controller = _$controller_;
      $stateParams = _$stateParams_;
      esnPreviousState = _esnPreviousState_;
      ticClientApiService = _ticClientApiService_;
      ticNotificationFactory = _ticNotificationFactory_;
      ticClientLogoService = _ticClientLogoService_;
    });
  });

  function initController() {
    var bindings = {
        form: form
      },
      controller = $controller('ticClientEditController',
        {
          $scope: $scope
        },
        bindings);

    $scope.$digest();

    return controller;
  }

  describe('the controller initialization', function() {
    it('should get client info from $stateParams.client when available', function() {
      var ctrl = initController();

      expect(ticClientApiService.getClient).to.not.have.been.called;
      expect(ctrl.client).to.deep.equal($stateParams.client);
    });

    it('should get client info from $stateParams.clientId when $stateParams.client is not available', function() {
      delete $stateParams.client;
      var ctrl = initController();

      expect(ticClientApiService.getClient).to.have.been.calledWith($stateParams.clientId);
      expect(ctrl.client).to.deep.equal(clientData.data);
    });
  });

  describe('the updateClient function', function() {
    it('should notify user when the form is invalid', function() {
      form.$invalid = true;
      var ctrl = initController();

      ctrl.updateClient();

      expect(ticNotificationFactory.weakError).to.have.been.calledWith('Error', 'Client is not valid');
    });

    it('should update client without logo', function() {
      var ctrl = initController();

      ctrl.updateClient();
      $rootScope.$digest();

      expect(ticClientLogoService.handleLogoUpload).to.have.been.calledWith(ctrl.client);
      expect(ticClientApiService.updateClient).to.have.been.calledWith(ctrl.client._id, ctrl.client);
      expect(ticNotificationFactory.weakInfo).to.have.been.calledWith('Success', 'Client Updated');
      expect(esnPreviousState.go).to.have.been.calledWith;
    });

    it('should update client and update logo', function() {
      ticClientLogoService.handleLogoUpload = sinon.spy(function(client) {
        client.logo = 'testLogo';

        return $q.when(client);
      });

      var ctrl = initController();

      ctrl.updateClient();
      $rootScope.$digest();

      expect(ticClientLogoService.handleLogoUpload).to.have.been.called;
      expect(ticClientApiService.updateClient).to.have.been.calledWith(
        '123', {
          _id: '123',
          name: 'Test',
          logo: 'testLogo'
        }
      );
      expect(ticNotificationFactory.weakInfo).to.have.been.calledWith('Success', 'Client Updated');
      expect(esnPreviousState.go).to.have.been.calledWith;
    });

    it('should fire notification when ticClientLogoService.handleLogoUpload reject', function() {
      var errorMsg = 'err message';

      ticClientLogoService.handleLogoUpload = sinon.spy(function() {
        return $q.reject({ data: { error: { message: errorMsg } } });
      });

      var ctrl = initController();

      ctrl.updateClient();
      $rootScope.$digest();

      expect(ticClientLogoService.handleLogoUpload).to.have.been.calledWith(ctrl.client);
      expect(ticClientApiService.updateClient).to.not.have.been.called;
      expect(ticNotificationFactory.weakInfo).to.not.have.been.called;
      expect(ticNotificationFactory.weakError).to.have.been.calledWith('Error', errorMsg);
    });

    it('should fire notification when ticClientApiService.updateClient reject', function() {
      var errorMsg = 'err message';

      ticClientApiService.updateClient = sinon.spy(function() {
        return $q.reject({ data: { error: { message: errorMsg } } });
      });

      var ctrl = initController();

      ctrl.updateClient();
      $rootScope.$digest();

      expect(ticClientLogoService.handleLogoUpload).to.have.been.calledWith(ctrl.client);
      expect(ticClientApiService.updateClient).to.have.been.called;
      expect(ticNotificationFactory.weakInfo).to.not.have.been.called;
      expect(ticNotificationFactory.weakError).to.have.been.calledWith('Error', errorMsg);
    });
  });
});
