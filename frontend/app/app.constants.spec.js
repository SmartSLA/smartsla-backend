'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The TICKETING_TIME_UNITS constant', function() {
  var TICKETING_TIME_UNITS;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(_TICKETING_TIME_UNITS_) {
      TICKETING_TIME_UNITS = _TICKETING_TIME_UNITS_;
    });
  });

  it('The list of units must be order by increasement of ratio', function() {
    var ratios = TICKETING_TIME_UNITS.map(function(unit) {
      return unit.ratio;
    });

    var sortedRatios = angular.copy(ratios).sort(function(a, b) {
      return a - b;
    });

    expect(sortedRatios).to.deep.equal(ratios);
  });
});
