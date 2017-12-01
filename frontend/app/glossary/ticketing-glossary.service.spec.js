'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingGlossaryService', function() {
  var $rootScope, TicketingGlossaryClient, TicketingGlossaryService;
  var TICKETING_GLOSSARY_EVENTS;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(
      _$controller_,
      _$rootScope_,
      _TicketingGlossaryClient_,
      _TicketingGlossaryService_,
      _TICKETING_GLOSSARY_EVENTS_
    ) {
      $rootScope = _$rootScope_;
      TicketingGlossaryClient = _TicketingGlossaryClient_;
      TicketingGlossaryService = _TicketingGlossaryService_;
      TICKETING_GLOSSARY_EVENTS = _TICKETING_GLOSSARY_EVENTS_;
    });
  });

  describe('The create function', function() {
    it('should reject if there is no glossary is provided', function(done) {
      TicketingGlossaryService.create()
        .catch(function(err) {
          expect(err.message).to.equal('glossary is required');
          done();
        });

      $rootScope.$digest();
    });

    it('should reject if failed to create glossary', function(done) {
      var error = new Error('something wrong');
      var glossary = { foo: 'bar' };

      TicketingGlossaryClient.create = sinon.stub().returns($q.reject(error));
      TicketingGlossaryService.create(glossary)
        .catch(function(err) {
          expect(TicketingGlossaryClient.create).to.have.been.calledWith(glossary);
          expect(err.message).to.equal(error.message);
          done();
        });

      $rootScope.$digest();
    });

    it('should fire an event if success to create glossary', function(done) {
      var glossary = { foo: 'bar' };

      TicketingGlossaryClient.create = sinon.stub().returns($q.when({ data: glossary }));
      $rootScope.$broadcast = sinon.spy();
      TicketingGlossaryService.create(glossary)
        .then(function() {
          expect(TicketingGlossaryClient.create).to.have.been.calledWith(glossary);
          expect($rootScope.$broadcast).to.have.been.calledWith(TICKETING_GLOSSARY_EVENTS.CREATED, glossary);
          done();
        });

      $rootScope.$digest();
    });
  });

  describe('The list function', function() {
    it('should call TicketingGlossaryClient.list to list glossaries', function(done) {
      var glossary = { word: 'foo' };
      var options = { foo: 'bar'};

      TicketingGlossaryClient.list = sinon.stub().returns($q.when({ data: [glossary] }));

      TicketingGlossaryService.list(options)
        .then(function(glossaries) {
          expect(TicketingGlossaryClient.list).to.have.been.calledWith(options);
          expect(glossaries).to.deep.equal([glossary]);
          done();
        });

      $rootScope.$digest();
    });
  });
});
