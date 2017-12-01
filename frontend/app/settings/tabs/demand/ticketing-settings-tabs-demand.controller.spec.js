'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingSettingsTabsDemandController', function() {
  var $controller, $rootScope;
  var TicketingGlossaryService, TICKETING_GLOSSARY_EVENTS, TICKETING_GLOSSARY_CATEGORIES;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(
      _$controller_,
      _$rootScope_,
      _TicketingGlossaryService_,
      _TICKETING_GLOSSARY_EVENTS_,
      _TICKETING_GLOSSARY_CATEGORIES_
    ) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      TicketingGlossaryService = _TicketingGlossaryService_;
      TICKETING_GLOSSARY_EVENTS = _TICKETING_GLOSSARY_EVENTS_;
      TICKETING_GLOSSARY_CATEGORIES = _TICKETING_GLOSSARY_CATEGORIES_;
    });
  });

  function initController($scope) {
    $scope = $scope || $rootScope.$new();
    var controller = $controller('TicketingSettingsTabsDemandController', { $scope: $scope });

    $scope.$digest();
    controller.$onInit();

    return controller;
  }

  it('should call TicketingGlossaryService.list to load glossaries', function() {
    TicketingGlossaryService.list = sinon.stub().returns($q.when());
    initController();

    expect(TicketingGlossaryService.list).to.have.been.called;
  });

  it('should add the new glossary at the end of list when glossary created event is fired', function() {
    TicketingGlossaryService.list = sinon.stub().returns($q.when([]));
    var newDemandType = { word: 'foo', category: TICKETING_GLOSSARY_CATEGORIES.DEMAND_TYPE };
    var newSoftwareType = { word: 'foo', category: TICKETING_GLOSSARY_CATEGORIES.SOFTWARE_TYPE };
    var newIssueType = { word: 'foo', category: TICKETING_GLOSSARY_CATEGORIES.ISSUE_TYPE };
    var controller = initController();

    $rootScope.$digest();

    $rootScope.$broadcast(TICKETING_GLOSSARY_EVENTS.CREATED, newDemandType);
    $rootScope.$broadcast(TICKETING_GLOSSARY_EVENTS.CREATED, newSoftwareType);
    $rootScope.$broadcast(TICKETING_GLOSSARY_EVENTS.CREATED, newIssueType);

    expect(controller.glossaries[0].group.length).to.equal(1);
    expect(controller.glossaries[0].group[0]).to.deep.equal(newDemandType);
    expect(controller.glossaries[1].group.length).to.equal(1);
    expect(controller.glossaries[1].group[0]).to.deep.equal(newSoftwareType);
    expect(controller.glossaries[2].group.length).to.equal(1);
    expect(controller.glossaries[2].group[0]).to.deep.equal(newIssueType);
  });
});
