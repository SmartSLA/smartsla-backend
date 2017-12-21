'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The TicketingService', function() {
  var TicketingService;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(_TicketingService_) {
      TicketingService = _TicketingService_;
    });
  });

  describe('The depopulate function', function() {
    it('should depopulate fields which is provided by keys', function() {
      var object = {
        a: { _id: 'a' },
        b: 'b',
        c: { _id: 'c' }
      };
      var keys = ['a', 'c'];

      TicketingService.depopulate(object, keys);

      expect(object).to.deep.equal({
        a: 'a',
        b: 'b',
        c: 'c'
      });
    });
  });
});
