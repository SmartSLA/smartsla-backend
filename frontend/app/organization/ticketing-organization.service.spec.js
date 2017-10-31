'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingOrganizationService', function() {
  var $rootScope;
  var TicketingOrganizationService, ticketingOrganizationClient;
  var TICKETING_ORGANIZATION_EVENTS;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(
      _$rootScope_,
      _TicketingOrganizationService_,
      _ticketingOrganizationClient_,
      _TICKETING_ORGANIZATION_EVENTS_
    ) {
      $rootScope = _$rootScope_;
      TicketingOrganizationService = _TicketingOrganizationService_;
      ticketingOrganizationClient = _ticketingOrganizationClient_;
      TICKETING_ORGANIZATION_EVENTS = _TICKETING_ORGANIZATION_EVENTS_;
    });
  });

  describe('The create function', function() {
    it('should reject if there is no organization', function(done) {
      TicketingOrganizationService.create()
        .catch(function(err) {
          expect(err).to.be.exist;
          expect(err.message).to.equal('Organization is required');
          done();
        });

      $rootScope.$digest();
    });

    it('should call ticketingOrganizationClient.create to create new organization', function(done) {
      var manager = { _id: 'userId' };
      var organization = { shortName: 'baz', manager: manager };

      ticketingOrganizationClient.create = sinon.stub().returns($q.when({
        data: {
          shortName: organization.shortName,
          manager: manager._id
        }
      }));
      $rootScope.$broadcast = sinon.spy();

      TicketingOrganizationService.create(organization)
        .then(function() {
          expect(ticketingOrganizationClient.create).to.have.been.calledWith({
            shortName: organization.shortName,
            manager: manager._id
          });
          expect($rootScope.$broadcast).to.have.been.calledWith(
            TICKETING_ORGANIZATION_EVENTS.ORGANIZATION_CREATED,
            {
              shortName: organization.shortName,
              manager: manager
            });
          done();
        })
        .catch(function(err) {
          done(err || 'should resolve');
        });

      $rootScope.$digest();
    });
  });
});
