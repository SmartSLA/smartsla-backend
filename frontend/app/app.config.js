(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .config(function(tagsInputConfigProvider) {
      // http://mbenford.github.io/ngTagsInput/documentation/global-configuration
      // Change the placeholder attribute dynamically
      tagsInputConfigProvider.setDefaults('tagsInput', { placeholder: '' });
      // Change the tags-input's placeholder attribute dynamically
      tagsInputConfigProvider.setActiveInterpolation('tagsInput', { placeholder: true });
    })
    .config(function(esnTemplateProvider) {
      esnTemplateProvider.setSuccessTemplate('/ticketing/app/app.html');
    });
})(angular);
