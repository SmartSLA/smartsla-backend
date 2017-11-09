'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingSearchAutoCompleteController', function() {
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

  function initController(scope, options) {
    options = options || {};
    $scope = scope || $rootScope.$new();

    var controller = $controller('TicketingSearchAutoCompleteController', { $scope: $scope }, options);

    $scope.$digest();
    controller.$onInit();

    return controller;
  }

  it('should set maxTags to MAX_SAFE_INTEGER if there is no maxTags is provided', function() {
    var controller = initController();

    expect(controller.maxTags).to.equal('MAX_SAFE_INTEGER');
  });

  it('should set maxTags if it is provided', function() {
    var options = { maxTags: 1 };
    var controller = initController(null, options);

    expect(controller.maxTags).to.equal(1);
  });

  describe('The onTagAdding fn', function() {
    var newTags;

    beforeEach(function() {
      newTags = [{ id: 'tag1Id' }];
    });

    it('should not add new tag if it already have been existed in array of new tag ids', function() {
      var controller = initController();
      var $tag = newTags[0];

      controller.newTags = newTags;
      var response = controller.onTagAdding($tag);

      expect(response).to.be.false;
    });

    it('should add new tag if it does not exist in list of tags', function() {
      var controller = initController();
      var $tag = { id: 'tag2Id' };

      controller.newTags = angular.copy(newTags);
      newTags.push($tag);

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
