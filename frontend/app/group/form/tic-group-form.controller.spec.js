'use strict';

/* global chai: false */

var expect = chai.expect;

describe('the ticGroupFormController', function() {

  var $rootscope, $scope, $controller;

  beforeEach(function() {
    angular.mock.module('linagora.esn.ticketing');

    angular.mock.inject(function(_$rootScope_, _$controller_) {
      $rootscope = _$rootScope_;
      $scope = $rootscope.$new();
      $controller = _$controller_;
    });
  });

  function initController(bindings) {
    bindings = bindings || {
        group: { name: 'linagora' },
        formName: 'formName'
    };
    var controller = $controller('ticGroupFormController',
      { $scope: $scope },
      bindings
    );

    $scope.$digest();

    return controller;
  }

  describe('the controller initialization', function() {
    it('should initialize scope group variable with controller group variable', function() {
      var ctrl = initController();

      expect($scope.group).to.equal(ctrl.group);
    });

    it('should set formName to "form" when not defined', function() {
      var bindings = {
        group: { name: 'linagora' }
      },
      ctrl = initController(bindings);

      expect(ctrl.formName).to.equal('form');
    });

    it('should set formName to ctrl.formName when defined', function() {
      var bindings = {
        group: { name: 'linagora' },
        formName: 'formName'
      },
      ctrl = initController(bindings);

      expect(ctrl.formName).to.equal(bindings.formName);
    });

    it('should expose $scope.form to the ctrl.form after $postLink', function() {
      var bindings = {
          formName: 'formName'
        },
        value = 'value';

      $scope[bindings.formName] = value;
      var ctrl = initController(bindings);

      expect(ctrl.form).to.be.undefined;

      ctrl.$postLink();

      expect(ctrl.form).to.equal(value);
    });
  });
});
