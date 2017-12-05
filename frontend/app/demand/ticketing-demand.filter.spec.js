'use strict';

/* global chai: false */
var expect = chai.expect;

describe('The ticketingDemandTime filter', function() {
  var $filter;
  var TICKETING_TIME_AVAILABLE_UNITS;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(_$filter_, _TICKETING_TIME_AVAILABLE_UNITS_) {
      $filter = _$filter_;
      TICKETING_TIME_AVAILABLE_UNITS = _TICKETING_TIME_AVAILABLE_UNITS_;
    });
  });

  it('should filter if input is undefined', function() {
    expect($filter('ticketingDemandTime')()).to.equal('0 ' + TICKETING_TIME_AVAILABLE_UNITS[0].text);
  });

  it('should filter if input is 0', function() {
    expect($filter('ticketingDemandTime')(0)).to.equal('0 ' + TICKETING_TIME_AVAILABLE_UNITS[0].text);
  });

  it('should return a correct string if input is odd of day', function() {
    expect($filter('ticketingDemandTime')(13)).to.equal('13 hour(s)');
  });

  it('should return a correct string if input is even of day', function() {
    expect($filter('ticketingDemandTime')(48)).to.equal('2 day(s)');
  });
});
