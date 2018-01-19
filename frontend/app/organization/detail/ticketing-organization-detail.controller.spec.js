'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingOrganizationDetailController', function() {
  var $controller, $rootScope, $scope;
  var $modalMock;
  var TICKETING_USER_EVENTS;
  var TicketingOrganizationService;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    $modalMock = {};

    angular.mock.module(function($provide) {
      $provide.value('$modal', $modalMock);
    });

    inject(function(
      _$controller_,
      _$rootScope_,
      _TICKETING_USER_EVENTS_,
      _TicketingOrganizationService_
    ) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      TICKETING_USER_EVENTS = _TICKETING_USER_EVENTS_;
      TicketingOrganizationService = _TicketingOrganizationService_;
    });
  });

  function initController(scope, options) {
    options = options || {};
    $scope = scope || $rootScope.$new();
    var controller = $controller('TicketingOrganizationDetailController', { $scope: $scope }, options);

    $scope.$digest();
    controller.$onInit();

    return controller;
  }

  it('should put the added user to the top of list user when user added event is fired', function() {
    var organization = {
      users: [
        { foo: 'foz' }
      ]
    };
    var userToAdd = { bar: 'baz' };
    var controller = initController(null, { organization: organization });

    $rootScope.$broadcast(TICKETING_USER_EVENTS.USER_CREATED, userToAdd);

    expect(controller.organization.users.length).to.equal(2);
    expect(controller.organization.users[0]).to.deep.equal(userToAdd);
  });

  describe('The onSaveBtnClick function', function() {
    var organization;

    beforeEach(function() {
      organization = {
        _id: 'organizationId'
      };
      TicketingOrganizationService.get = function() {
        return $q.when(organization);
      };
    });

    it('should reject if failed to update organization', function(done) {
      var error = new Error('something wrong');
      var organization = { foo: 'bar' };
      var controller = initController(null, { organization: organization });

      TicketingOrganizationService.update = sinon.stub().returns($q.reject(error));
      controller.organization = organization;

      controller.onSaveBtnClick()
        .catch(function(err) {
          expect(err.message).to.equal(error.message);
          expect(TicketingOrganizationService.update).to.have.been.calledWith(organization);
          done();
        });

      $rootScope.$digest();
    });

    it('should resolve if success to update organization', function(done) {
      var organization = { foo: 'bar' };
      var controller = initController(null, { organization: organization });

      TicketingOrganizationService.update = sinon.stub().returns($q.when());
      controller.organization = organization;

      controller.onSaveBtnClick()
        .then(function() {
          expect(TicketingOrganizationService.update).to.have.been.calledWith(organization);
          expect(controller.isEditMode).to.equal(false);
          done();
        })
        .catch(function(err) {
          done(err || 'should resolve');
        });

      $rootScope.$digest();
    });
  });
});
