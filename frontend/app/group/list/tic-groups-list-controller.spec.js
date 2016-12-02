'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('the groupsListController', function() {
  var $rootScope, $controller, $q, $stateParams, ticGroupApiService, ticClientApiService, clientData, groupsData;

  beforeEach(function() {
    groupsData = { data: {} };

    ticGroupApiService = {
      getClientGroups: sinon.spy(function() {
        return $q.when(groupsData);
      })
    };

    clientData = { data: { name: 'getClientData' } };

    ticClientApiService = {
      getClient: sinon.spy(function() {
        return $q.when(clientData);
      })
    };

    $stateParams = {
      client: {
        _id: '123',
        name: 'client',
        groups: []
      },
      clientId: '123'
    };

    angular.mock.module('linagora.esn.ticketing', function($provide) {
      $provide.value('ticGroupApiService', ticGroupApiService);
      $provide.value('$stateParams', $stateParams);
      $provide.value('ticClientApiService', ticClientApiService);
    });

    angular.mock.inject(function(_$rootScope_, _$controller_, _$q_, _$stateParams_, _ticGroupApiService_) {
      $rootScope = _$rootScope_;
      $q = _$q_;
      $controller = _$controller_;
      $stateParams = _$stateParams_;
      ticGroupApiService = _ticGroupApiService_;
    });
  });

  function initController() {
    return $controller('ticGroupsListController');
  }

  describe('the initialization function', function() {

    it('should call ticClientApiService.getClient() with $stateParams.clientId when $stateParams.client is not available', function() {
      delete $stateParams.client;

      initController();

      expect(ticClientApiService.getClient).to.have.been.calledWith($stateParams.clientId);
    });

    it('should not call ticClientApiService.getClient() when $stateParams.client exists', function() {
      initController();

      $rootScope.$digest();

      expect(ticClientApiService.getClient).to.not.have.been.called;
      expect(ticGroupApiService.getClientGroups).to.have.been.calledWith($stateParams.client.groups);
    });

    it('should not call ticGroupApiService.getClientGroups() if client does not exist', function() {
      delete $stateParams.client;
      delete $stateParams.clientId;

      expect(ticGroupApiService.getClientGroups).to.not.have.been.called;
    });

    it('should expose groups to the controller', function() {
      var ctrl = initController();

      $rootScope.$digest();

      expect(ticGroupApiService.getClientGroups).to.have.been.calledWith($stateParams.client.groups);
      expect(ctrl.groups).to.equal(groupsData.data);
    });
  });
});
