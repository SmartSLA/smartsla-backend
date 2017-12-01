'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingSearchAutoCompleteController', function() {
  var $controller, $rootScope, $scope, $elementMock;
  var elementScrollService, TicketingSearchService;
  var DEFAULT_MAX_TAGS;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    $elementMock = {
      find: function() {}
    };
    DEFAULT_MAX_TAGS = 1000;

    module(function($provide) {
      $provide.value('$element', $elementMock);
    });

    inject(function(
      _$controller_,
      _$rootScope_,
      _elementScrollService_,
      _TicketingSearchService_
    ) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      elementScrollService = _elementScrollService_;
      TicketingSearchService = _TicketingSearchService_;
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

    expect(controller.maxTags).to.equal(DEFAULT_MAX_TAGS);
  });

  it('should set maxTags if it is provided', function() {
    var options = { maxTags: 1 };
    var controller = initController(null, options);

    expect(controller.maxTags).to.equal(1);
  });

  it('should set objectTypes to undefined if there is no objectTypes is given', function() {
    var controller = initController();

    expect(controller.objectTypes).to.be.undefined;
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

    it('should not add a new tag if the number of tags is reached the limit', function() {
      var options = { maxTags: 1 };
      var controller = initController(null, options);
      var $tag = { id: 'tag2Id' };

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

  describe('The onTagAdded function', function() {
    it('should call elementScrollService.autoScrollDown', function() {
      elementScrollService.autoScrollDown = sinon.spy();

      var controller = initController();

      controller.onTagAdded();

      expect(elementScrollService.autoScrollDown).to.have.been.calledOnce;
    });
  });

  describe('The search function', function() {
    var newTags, searchedList;

    beforeEach(function() {
      newTags = [{ id: 'tag1Id' }];
      searchedList = [{ foo: 'bar' }];
      TicketingSearchService.search = sinon.stub().returns($q.when(searchedList));
    });

    it('should return an empty array if the number of tags is reached the limit', function(done) {
      var options = { maxTags: 1 };
      var controller = initController(null, options);

      controller.newTags = newTags;
      controller.search()
        .then(function(result) {
          expect(result.length).to.equal(0);
          expect(TicketingSearchService.search).to.not.have.been.called;
          done();
        })
        .catch(function(err) {
          done(err || 'should resolve');
        });

        $rootScope.$digest();
    });

    it('should call TicketingSearchService.search function to search', function(done) {
      var controller = initController();
      var query = 'abc';

      controller.newTags = newTags;
      controller.search(query)
        .then(function(result) {
          expect(result.length).to.equal(searchedList.length);
          expect(result).to.deep.equal(searchedList);
          expect(TicketingSearchService.search).to.have.been.calledWith({
            search: query,
            limit: 20
          });
          done();
        })
        .catch(function(err) {
          done(err || 'should resolve');
        });

        $rootScope.$digest();
    });
  });
});
