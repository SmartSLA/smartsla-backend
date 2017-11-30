'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingGlossaryFormController', function() {
  var $rootScope, $controller;
  var TicketingGlossaryService;

  beforeEach(function() {
    module('linagora.esn.ticketing');

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

  function initController(scope) {
    scope = scope || $rootScope.$new();

    var controller = $controller('TicketingGlossaryFormController', { scope: scope });

    scope.$digest();

    return controller;
  }

  describe('The save function', function() {
    it('shoud reject if form is invalid', function(done) {
      var controller = initController();
      var form = {
        $valid: false
      };

      TicketingGlossaryService.create = sinon.stub().returns($q.when());

      controller.save(form)
        .catch(function(err) {
            expect(err).to.be.exist;
            expect(err.message).to.equal('Form is invalid');
            expect(TicketingGlossaryService.create).to.have.not.been.called;
            done();
          });

      $rootScope.$digest();
    });

    it('should call TicketingGlossaryService.create to add new glossary', function(done) {
      var controller = initController();
      var glossary = { word: 'foo' };
      var form = {
        $valid: true,
        $setPristine: sinon.spy()
      };

      TicketingGlossaryService.create = sinon.stub().returns($q.when());
      controller.glossary = glossary;

      controller.save(form);

      $rootScope.$digest();

      expect(TicketingGlossaryService.create).to.have.been.calledWith(glossary);
      done();
    });
  });
});
