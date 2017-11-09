'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The TicketingSearchService', function() {
  var TicketingSearchService;
  var currentProviders;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(_TicketingSearchService_) {
      TicketingSearchService = _TicketingSearchService_;
    });

    currentProviders = angular.copy(TicketingSearchService.getProviders());
  });

  describe('The addProvider function', function() {
    it('should not add an undefined provider', function() {
      TicketingSearchService.addProvider(undefined);

      expect(TicketingSearchService.getProviders().length).to.deep.equal(currentProviders.length);
    });

    it('should not add if provider has no search function', function() {
      var provider = {};

      TicketingSearchService.addProvider(provider);

      expect(TicketingSearchService.getProviders().length).to.deep.equal(currentProviders.length);
    });

    it('should add a provider', function() {
      var provider = {
        search: function() {},
        objectType: 'abc'
      };

      TicketingSearchService.addProvider(provider);

      expect(TicketingSearchService.getProviders().length).to.equal(currentProviders.length + 1);
    });
  });
});
