'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The ticketingEmptyMessage component', function() {
  var $rootScope, $compile;

  beforeEach(function() {
    module('jadeTemplates');
    module('linagora.esn.ticketing');
  });

  beforeEach(inject(function(_$rootScope_, _$compile_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));

  function initDirective(html) {
    var scope = $rootScope.$new();
    var element = $compile(html)(scope);

    scope.$digest();

    return element;
  }

  it('should display the message', function() {
    var element = initDirective('<ticketing-empty-message message="whatever" />');

    expect(element.find('.message').html()).to.equal('whatever');
  });

  it('should display icon basing on type (error)', function() {
    var element = initDirective('<ticketing-empty-message type="error" />');

    expect(element.find('i.mdi-alert-circle')).to.have.length(1);
  });

  it('should support custom icon', function() {
    var element = initDirective('<ticketing-empty-message icon="whatever" />');

    expect(element.find('i.whatever')).to.have.length(1);
  });

  it('should not display icon when both type and icon are not provided', function() {
    var element = initDirective('<ticketing-empty-message />');

    expect(element.find('i.mdi')).to.have.length(0);
  });

});
