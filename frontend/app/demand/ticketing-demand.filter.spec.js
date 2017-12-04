'use strict';

/* global chai: false */
var expect = chai.expect;

describe('The ticketingDemandTime filter', function() {
  var $filter;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(_$filter_) {
      $filter = _$filter_;
    });
  });

  it('should return a correct string if input is odd of day', function() {
    expect($filter('ticketingDemandTime')(13)).to.equal('13 hour(s)');
  });

  it('should return a correct string if input is even of day', function() {
    expect($filter('ticketingDemandTime')(48)).to.equal('2 day(s)');
  });
});
