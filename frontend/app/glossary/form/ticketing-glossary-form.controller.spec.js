'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingGlossaryFormController', function() {
  var $rootScope, $controller;
  var TicketingGlossaryService;
  var group;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    group = {
      category: 'category'
    };

    inject(function(
      _$rootScope_,
      _$controller_,
      _TicketingGlossaryService_
    ) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      TicketingGlossaryService = _TicketingGlossaryService_;
    });
  });

  function initController($scope, options) {
    $scope = $scope || $rootScope.$new();

    var controller = $controller('TicketingGlossaryFormController', { $scope: $scope }, options);

    $scope.$digest();
    controller.$onInit();

    return controller;
  }

  describe('The onAddBtnClick function', function() {
    it('shoud reject if form is invalid', function(done) {
      var controller = initController(null, { group: group });
      var form = {
        $valid: false
      };

      TicketingGlossaryService.create = sinon.stub().returns($q.when());

      controller.onAddBtnClick(form)
        .catch(function(err) {
            expect(err).to.be.exist;
            expect(err.message).to.equal('Form is invalid');
            expect(TicketingGlossaryService.create).to.have.not.been.called;
            done();
          });

      $rootScope.$digest();
    });

    it('should call TicketingGlossaryService.create to add new glossary', function(done) {
      var controller = initController(null, { group: group });
      var glossary = { word: 'foo' };
      var form = {
        $valid: true,
        $setPristine: sinon.spy(),
        $setUntouched: sinon.spy()
      };

      TicketingGlossaryService.create = sinon.stub().returns($q.when());
      controller.glossary = glossary;

      controller.onAddBtnClick(form);

      $rootScope.$digest();

      expect(TicketingGlossaryService.create).to.have.been.calledWith(glossary);
      expect(form.$setPristine).to.have.been.calledOnce;
      expect(form.$setUntouched).to.have.been.calledOnce;
      expect(controller.glossary).to.deep.equal({
        category: group.category
      });
      done();
    });
  });

  describe('The uniqueWord function', function() {
    beforeEach(function() {
      group.glossaries = [
        { word: 'word1' }
      ];
    });

    it('should return false if there is no word provided', function() {
      var controller = initController(null, { group: group });

      expect(controller.uniqueWord()).to.be.false;
    });

    it('should return false if word already exists', function() {
      var controller = initController(null, { group: group });

      expect(controller.uniqueWord(group.glossaries[0].word)).to.be.false;
    });

    it('should return true if word is valid', function() {
      var controller = initController(null, { group: group });

      expect(controller.uniqueWord('valid word')).to.be.true;
    });
  });
});
