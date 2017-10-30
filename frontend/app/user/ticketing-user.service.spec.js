'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingUserService', function() {
  var $rootScope;
  var TicketingUserService, ticketingUserClient;
  var TICKETING_USER_EVENTS;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(
      _$rootScope_,
      _TicketingUserService_,
      _ticketingUserClient_,
      _TICKETING_USER_EVENTS_
    ) {
      $rootScope = _$rootScope_;
      TicketingUserService = _TicketingUserService_;
      ticketingUserClient = _ticketingUserClient_;
      TICKETING_USER_EVENTS = _TICKETING_USER_EVENTS_;
    });
  });

  describe('The create function', function() {
    it('should reject if user is not given', function(done) {
      TicketingUserService.create()
        .catch(function(err) {
          expect(err).to.be.exist;
          expect(err.message).to.equal('User is required');
          done();
        });

      $rootScope.$digest();
    });

    it('should call ticketingUserClient.create to create new user', function(done) {
      var user = {
        firstname: 'foo',
        lastname: 'bar',
        email: 'bar@tic.org',
        main_phone: '888'
      };

      ticketingUserClient.create = sinon.stub().returns($q.when({
        data: user
      }));
      $rootScope.$broadcast = sinon.spy();

      TicketingUserService.create(user)
        .then(function() {
          expect(ticketingUserClient.create).to.have.been.calledWith(user);
          expect($rootScope.$broadcast).to.have.been.calledWith(TICKETING_USER_EVENTS.USER_CREATED, user);
          done();
        })
        .catch(function(err) {
          done(err || 'should resolve');
        });

      $rootScope.$digest();
    });
  });
});
