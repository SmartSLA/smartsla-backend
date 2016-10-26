'use strict';

angular.module('linagora.esn.ticketing')
  .factory('ticNotificationFactory', function($translate, notificationFactory) {

    function weakSuccess(title, text) {
      $translate([title, text]).then(function(translations) {
        return notificationFactory.weakSuccess(translations[title], translations[text]);
      });
    }

    function weakInfo(title, text) {
      $translate([title, text]).then(function(translations) {
        notificationFactory.weakInfo(translations[title], translations[text]);
      });
    }

    function weakError(title, text) {
      $translate([title, text]).then(function(translations) {
        notificationFactory.weakError(translations[title], translations[text]);
      });
    }

    function strongInfo(title, text) {
      $translate([title, text]).then(function(translations) {
        notificationFactory.strongInfo(translations[title], translations[text]);
      });
    }

    function strongError(title, text) {
      $translate([title, text]).then(function(translations) {
        notificationFactory.strongError(translations[title], translations[text]);
      });
    }

    return {
      weakInfo: weakInfo,
      weakError: weakError,
      weakSuccess: weakSuccess,
      strongInfo: strongInfo,
      strongError: strongError
    };
  });
