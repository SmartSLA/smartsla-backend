'use strict';

/* global chai: false */
var expect = chai.expect;

describe('The ticketingTime filter', function() {
  var $filter;
  var TICKETING_TIME_UNITS;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(_$filter_, _TICKETING_TIME_UNITS_) {
      $filter = _$filter_;
      TICKETING_TIME_UNITS = _TICKETING_TIME_UNITS_;
    });
  });

  it('should return a correct string if input is undefined', function() {
    expect($filter('ticketingTime')()).to.equal('0 ' + TICKETING_TIME_UNITS[0].name);
  });

  it('should return a correct string if input is 0', function() {
    expect($filter('ticketingTime')(0)).to.equal('0 ' + TICKETING_TIME_UNITS[0].name);
  });

  it('should return a correct string if input is odd of hours', function() {
    expect($filter('ticketingTime')(65)).to.equal('1 hour 5 minutes');
  });

  it('should return a correct string if input is even of hours', function() {
    expect($filter('ticketingTime')(120)).to.equal('2 hours');
  });
});
