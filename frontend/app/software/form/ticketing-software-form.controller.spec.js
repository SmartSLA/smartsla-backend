'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingSoftwareFormController', function() {
  var $controller, $rootScope, ticketingSoftwareClient;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(_$controller_, _$rootScope_, _ticketingSoftwareClient_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      ticketingSoftwareClient = _ticketingSoftwareClient_;
    });
  });

  function initController(scope) {
    scope = scope || $rootScope.$new();

    var controller = $controller('TicketingSoftwareFormController', { scope: scope });

    scope.$digest();

    return controller;
  }

  describe('The uniqueSoftwareName function', function() {
    it('should reject if there is no software name is provided', function(done) {
      var controller = initController();

      controller.uniqueSoftwareName()
        .catch(function(err) {
          expect(err.message).to.equal('Software name required');
          done();
        });

      $rootScope.$digest();
    });

    it('should reject if software already exist', function(done) {
      ticketingSoftwareClient.getByName = sinon.stub().returns($q.when({ data: [{ foo: 'bar' }] }));
      var controller = initController();

      controller.uniqueSoftwareName('abc')
        .catch(function(err) {
          expect(err.message).to.equal('Software already exists');
          done();
        });

      $rootScope.$digest();
    });

    it('should resolve if software does not exist', function(done) {
      ticketingSoftwareClient.getByName = sinon.stub().returns($q.when({ data: [] }));
      var controller = initController();

      controller.uniqueSoftwareName('abc')
        .then(function() {
          done();
        })
        .catch(function(err) {
          done(err || 'should resolve');
        });

      $rootScope.$digest();
    });
  });
});
