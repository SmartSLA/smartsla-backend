'use strict';

/* global chai: false */
var expect = chai.expect;

describe('The ticketingJoinArray filter', function() {
  var $filter, array;

  beforeEach(function() {
    module('linagora.esn.ticketing');
    array = ['1', '2'];

    inject(function(_$filter_) {
      $filter = _$filter_;
    });
  });

  it('should join array with default separator', function() {
    expect($filter('ticketingJoinArray')(array)).to.equal('1, 2');
  });

  it('should join array with custom separator', function() {
    expect($filter('ticketingJoinArray')(array, '; ')).to.equal('1; 2');
  });
});
