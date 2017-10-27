'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingUserAutoCompleteController', function() {
  var $controller, $rootScope, $scope, $elementMock;
  var elementScrollService;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    $elementMock = {
      find: function() {}
    };

    module(function($provide) {
      $provide.value('$element', $elementMock);
    });

    inject(function(_$controller_, _$rootScope_, _elementScrollService_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      elementScrollService = _elementScrollService_;
    });
  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('TicketingUserAutoCompleteController', { $scope: $scope });

    $scope.$digest();

    return controller;
  }

  describe('The onTagAdding fn', function() {
    var newUsers;

    beforeEach(function() {
      newUsers = [{ id: 'user1Id' }];
    });

    it('should not add new tag if it already have been existed in array of new user ids', function() {
      var controller = initController();
      var $tag = newUsers[0];

      controller.newUsers = newUsers;
      var response = controller.onTagAdding($tag);

      expect(response).to.be.false;
    });

    it('should add new tag if it does not exist in list of tags', function() {
      var controller = initController();
      var $tag = { id: 'user2Id' };

      controller.newUsers = angular.copy(newUsers);
      newUsers.push($tag);

      var response = controller.onTagAdding($tag);

      expect(response).to.be.true;
    });
  });

  describe('The onTagAdded fn', function() {
    it('should call elementScrollService.autoScrollDown', function() {
      elementScrollService.autoScrollDown = sinon.spy();

      var controller = initController();

      controller.onTagAdded();

      expect(elementScrollService.autoScrollDown).to.have.been.calledOnce;
    });
  });
});
