(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .constant('TICKETING_GLOSSARY_EVENTS', {
      CREATED: 'ticketing:glossary:created'
    })
    .constant('TICKETING_GLOSSARY_CATEGORIES', {
      DEMAND_TYPE: 'Demand type',
      SOFTWARE_TYPE: 'Software type',
      ISSUE_TYPE: 'Issue type'
    });
})(angular);
