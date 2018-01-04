'use stric';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingTicketCreateController', function() {
  var $rootScope, $controller;
  var TicketingTicketService;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(
      _$rootScope_,
      _$controller_,
      _TicketingTicketService_
    ) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      TicketingTicketService = _TicketingTicketService_;
    });
  });

  function initController() {
    var $scope = $rootScope.$new();

    var controller = $controller('TicketingTicketCreateController', { $scope: $scope });

    $scope.$digest();

    return controller;
  }

  describe('The create function', function() {
    it('should reject if failed to create ticket', function(done) {
      var ticket = { foo: 'bar' };

      TicketingTicketService.create = sinon.stub().returns($q.reject());
      var controller = initController();

      controller.ticket = ticket;
      controller.create()
        .catch(function() {
          expect(TicketingTicketService.create).to.have.been.calledWith(ticket);
          done();
        });

      $rootScope.$digest();
    });

    it('should resolve if success to create ticket', function(done) {
      var ticket = { foo: 'bar' };

      TicketingTicketService.create = sinon.stub().returns($q.when());
      var controller = initController();

      controller.ticket = ticket;
      controller.create()
        .then(function() {
          expect(TicketingTicketService.create).to.have.been.calledWith(ticket);
          done();
        }, function(err) {
          done(err || 'should resolve');
        });

      $rootScope.$digest();
    });
  });
});
