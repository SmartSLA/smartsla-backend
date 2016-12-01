'use strict';

angular.module('linagora.esn.ticketing')
  .factory('ticNotificationFactory', function($translate, notificationFactory) {

    return {
      weakInfo: translate('weakInfo'),
      weakError: translate('weakError'),
      weakSuccess: translate('weakSuccess'),
      strongInfo: translate('strongInfo'),
      strongError: translate('strongError')
    };

    /////////////

    function translate(methodName) {
      return function(title, text) {
        $translate([title, text]).then(function(translations) {
          return notificationFactory[methodName](translations[title], translations[text]);
        });
      };
    }
  });
