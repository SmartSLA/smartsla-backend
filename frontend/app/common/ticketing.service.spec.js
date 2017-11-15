'use strict';

/* global chai: false */
/* global sinon: false */

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

  describe('The handleAutoCompleteWithOneTag function', function() {
    it('should set scope properties and watch them', function() {
      var scope = {
        $watch: sinon.spy()
      };
      var object = {
        foo: 'abc',
        bar: 'efg'
      };
      var keysMap = {
        FOO: 'foo',
        BAR: 'bar'
      };

      TicketingService.handleAutoCompleteWithOneTag(scope, object, keysMap);

      expect(scope.FOO).to.deep.equal([object.foo]);
      expect(scope.BAR).to.deep.equal([object.bar]);
      expect(scope.$watch).to.have.been.calledTwice;
    });
  });
});
