(function() {
  /*eslint strict: [2, "function"]*/

  'use strict';

  angular.module('linagora.esn.ticketing')
         .component('ticApplicationMenuEsn', ticApplicationMenuEsn);

  ticApplicationMenuEsn.$inject = [
    'applicationMenuTemplateBuilder'
  ];

  function ticApplicationMenuEsn() {
    var component = {
      template: template
    };

    return component;
  }

  ////////////

  function template(applicationMenuTemplateBuilder) {
    return applicationMenuTemplateBuilder('/#/ticketing', 'mdi-thumb-up', 'My Module');
  }

})();
