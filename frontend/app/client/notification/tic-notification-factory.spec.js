'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The ticNotification factory', function() {
  var $q, $rootScope, $scope, $translate, notificationFactory, ticNotificationFactory, title, text, translatedTitle, translatedText;

  beforeEach(function() {

    notificationFactory = {
      weakInfo: sinon.spy(),
      weakError: sinon.spy(),
      weakSuccess: sinon.spy(),
      strongInfo: sinon.spy(),
      strongError: sinon.spy()
    };

    $translate = sinon.spy(function(translations) {
      var translateObj = {};

      translations.forEach(function(element) {
        translateObj[element] = '_' + element + '_';
      });

      return $q.when(translateObj);
    });

    title = 'TEST';
    text = 'TEST2';

    translatedTitle = '_TEST_';
    translatedText = '_TEST2_';

    angular.mock.module('linagora.esn.ticketing', function($provide) {
      $provide.value('$translate', $translate);
      $provide.value('notificationFactory', notificationFactory);
    });

    angular.mock.inject(function(_$q_, _$rootScope_, _$translate_, _notificationFactory_, _ticNotificationFactory_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $translate = _$translate_;
      notificationFactory = _notificationFactory_;
      ticNotificationFactory = _ticNotificationFactory_;
    });

  });

  describe('the weakInfo function', function() {
    it('should create a translated notification weakInfo', function() {
      ticNotificationFactory.weakInfo(title, text);
      $scope.$digest();

      expect($translate).to.have.been.calledWith([title, text]);
      expect(notificationFactory.weakInfo).to.have.been.calledWith(translatedTitle, translatedText);
    });
  });

  describe('the weakError function', function() {
    it('should create a translated notification weakError', function() {
      ticNotificationFactory.weakError(title, text);
      $scope.$digest();

      expect($translate).to.have.been.calledWith([title, text]);
      expect(notificationFactory.weakError).to.have.been.calledWith(translatedTitle, translatedText);
    });
  });

  describe('the weakSuccess function', function() {
    it('should create a translated notification weakSuccess', function() {
      ticNotificationFactory.weakSuccess(title, text);
      $scope.$digest();

      expect($translate).to.have.been.calledWith([title, text]);
      expect(notificationFactory.weakSuccess).to.have.been.calledWith(translatedTitle, translatedText);
    });
  });

  describe('the strongInfo function', function() {
    it('should create a translated notification strongInfo', function() {
      ticNotificationFactory.strongInfo(title, text);
      $scope.$digest();

      expect($translate).to.have.been.calledWith([title, text]);
      expect(notificationFactory.strongInfo).to.have.been.calledWith(translatedTitle, translatedText);
    });
  });

  describe('the strongError function', function() {
    it('should create a translated notification strongError', function() {
      ticNotificationFactory.strongError(title, text);
      $scope.$digest();

      expect($translate).to.have.been.calledWith([title, text]);
      expect(notificationFactory.strongError).to.have.been.calledWith(translatedTitle, translatedText);
    });
  });
});
