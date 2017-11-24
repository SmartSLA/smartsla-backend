'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The ticketingSelectionSelectAllController component', function() {
  var $rootScope, $compile, TicketingSelectionService;
  var scope;

  beforeEach(function() {
    module('jadeTemplates');
    angular.mock.module('linagora.esn.ticketing');
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

  function initComponent() {
    scope = $rootScope.$new();
    scope.items = [{}, {}];

    var element = $compile('<ticketing-selection-select-all items="items" />')(scope);

    scope.$digest();

    return element;
  }

  it('should toggle select all on click', function() {
    TicketingSelectionService.toggleItemSelection = sinon.spy();
    TicketingSelectionService.unselectAllItems = sinon.spy();

    var element = initComponent();

    element.find('.checkbox').click();
    expect(element.find('input')[0].checked).to.equal(true);
    expect(TicketingSelectionService.toggleItemSelection).to.have.been.callCount(scope.items.length);

    element.find('.checkbox').click();
    expect(element.find('input')[0].checked).to.equal(false);
    expect(TicketingSelectionService.unselectAllItems).to.have.been.calledOnce;
  });

  it('should unselect all on destroy event', function() {
    TicketingSelectionService.unselectAllItems = sinon.spy();

    initComponent();
    scope.$destroy();

    expect(TicketingSelectionService.unselectAllItems).to.have.been.calledOnce;
  });

  it('should check the checkbox if the number of selected items equals items.length', function() {
    TicketingSelectionService.getSelectedItems = function() {
      return scope.items.slice(0);
    };

    var element = initComponent();

    expect(element.find('input')[0].checked).to.equal(true);
  });

  it('should not check the checkbox if the number of selected items changed and does not equal items.length', function() {
    TicketingSelectionService.getSelectedItems = function() {
      return scope.items.slice(0);
    };

    var element = initComponent();

    expect(element.find('input')[0].checked).to.equal(true);

    TicketingSelectionService.getSelectedItems = function() {
      return scope.items.slice(1);
    };
    scope.$digest();

    expect(element.find('input')[0].checked).to.equal(false);
  });

  it('should not check the checkbox if there is no items', function() {
    TicketingSelectionService.getSelectedItems = function() {
      return scope.items.slice(0);
    };

    var element = initComponent();

    scope.items = [];
    scope.$digest();

    expect(element.find('input')[0].checked).to.equal(false);
  });

});
