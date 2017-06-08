'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The ticGroupApi service', function() {
  var $httpBackend, ticGroupApiService, $window;

  beforeEach(function() {
    angular.mock.module('linagora.esn.ticketing');

    angular.mock.inject(function(_$httpBackend_, _ticGroupApiService_, _$window_) {
      $httpBackend = _$httpBackend_;
      ticGroupApiService = _ticGroupApiService_;
      $window = _$window_;
    });
  });

  describe('the getClientGroups function', function() {
    var groupIds, option;

    function _encodeURIJSONStringify(json) {
      return $window.encodeURI(JSON.stringify(json));
    }

    it('should send a request to /linagora.esn.ticketing/api/groups', function() {
      groupIds = ['1', '2'];
      option = {
        _id: {
          $in: groupIds
        }
      };

      $httpBackend.expectGET('/linagora.esn.ticketing/api/groups?option=' + _encodeURIJSONStringify(option)).respond(200, []);
      ticGroupApiService.getClientGroups(groupIds);

      $httpBackend.flush();
    });

    it('should send a request to /linagora.esn.ticketing/api/groups when the array of ids is empty', function() {
      groupIds = [];
      option = {
        _id: {
          $in: groupIds
        }
      };

      $httpBackend.expectGET('/linagora.esn.ticketing/api/groups?option=' + _encodeURIJSONStringify(option)).respond(200, []);
      ticGroupApiService.getClientGroups(groupIds);

      $httpBackend.flush();
    });

    it('should send a request to /linagora.esn.ticketing/api/groups when the array of ids is undefined', function() {
      groupIds = undefined;
      option = {
        _id: {
          $in: []
        }
      };

      $httpBackend.expectGET('/linagora.esn.ticketing/api/groups?option=' + _encodeURIJSONStringify(option)).respond(200, []);
      ticGroupApiService.getClientGroups(groupIds);

      $httpBackend.flush();
    });
  });

  describe('the createGroup function', function() {
    var group;

    beforeEach(function() {
      group = {
        name: 'Test'
      };
    });

    it('should send a request to /linagora.esn.ticketing/api/groups', function() {
      $httpBackend.expectPOST('/linagora.esn.ticketing/api/groups', group).respond(200, []);
      ticGroupApiService.createGroup(group);

      $httpBackend.flush();
    });
  });

  describe('the createGroups function', function() {
    var client = {};

    beforeEach(function() {
      client = {
        groups: [{ _id: '123', name: 'Test' }, { _id: '456', name: 'Test1' }]
      };

      ticGroupApiService.createGroup = sinon.spy(function() {
        return $q.when();
      });

    });

    it('should create groups with createGroup function', function() {
      ticGroupApiService.createGroups(client).then(function(_client) {
        expect(_client.groups).to.be.deep.equal(['123', '456']);
        expect(ticGroupApiService.createGroup).to.be.called;
      });
    });
  });
});
