'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingSoftwareFormController', function() {
  var $controller, $rootScope, TicketingSoftwareService;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(_$controller_, _$rootScope_, _TicketingSoftwareService_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      TicketingSoftwareService = _TicketingSoftwareService_;
    });
  });

  function initController(scope, options) {
    scope = scope || $rootScope.$new();
    options = options || {};
    options.software = options.software || {};

    var controller = $controller('TicketingSoftwareFormController', { scope: scope }, options);

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

    it('should reject if software already exists', function(done) {
      TicketingSoftwareService.getByName = sinon.stub().returns($q.when({ _id: '1', name: 'foo' }));
      var controller = initController();

      controller.uniqueSoftwareName('foo')
        .catch(function(err) {
          expect(err.message).to.equal('Software already exists');
          done();
        });

      $rootScope.$digest();
    });

    it('should resolve if the software name is not taken by another software', function(done) {
      var software = { _id: '1', name: 'foo' };

      TicketingSoftwareService.getByName = sinon.stub().returns($q.when(software));
      var controller = initController(null, { software: software });

      controller.uniqueSoftwareName('foo')
        .then(function() {
          done();
        })
        .catch(function(err) {
          done(err || 'should resolve');
        });

      $rootScope.$digest();
    });

    it('should resolve if software does not exist', function(done) {
      TicketingSoftwareService.getByName = sinon.stub().returns($q.when());
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
