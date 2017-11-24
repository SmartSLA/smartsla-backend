'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The ticketingSelectable directive', function() {
  var $rootScope, $compile, TicketingSelectionService;
  var scope;

  beforeEach(function() {
    module('jadeTemplates');
    module('linagora.esn.ticketing');
  });

  beforeEach(inject(function(
    _$rootScope_,
    _$compile_,
    _TicketingSelectionService_
  ) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    TicketingSelectionService = _TicketingSelectionService_;
  }));

  function initDirective(html) {
    scope = $rootScope.$new();
    scope.item = {};

    var element = $compile(html || '<form><ticketing-selectable item="item"><span class="test">test</span></ticketing-selectable></form>')(scope);

    scope.$digest();

    return element;
  }

  it('should toggle select the item on click', function() {
    TicketingSelectionService.toggleItemSelection = sinon.spy();

    var element = initDirective();

    element.find('.ticketing-selectable').click();

    expect(TicketingSelectionService.toggleItemSelection).to.have.been.calledOnce;
    expect(TicketingSelectionService.toggleItemSelection).to.have.been.calledWith(scope.item);
  });
});
