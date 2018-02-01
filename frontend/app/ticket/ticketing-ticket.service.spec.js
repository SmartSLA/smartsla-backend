'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingTicketService', function() {
  var $rootScope, TicketingTicketClient, TicketingTicketService;
  var TICKETING_TICKET_EVENTS;
  var ticketId;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(
      _$controller_,
      _$rootScope_,
      _TicketingTicketClient_,
      _TicketingTicketService_,
      _TICKETING_TICKET_EVENTS_
    ) {
      $rootScope = _$rootScope_;
      TicketingTicketClient = _TicketingTicketClient_;
      TicketingTicketService = _TicketingTicketService_;
      TICKETING_TICKET_EVENTS = _TICKETING_TICKET_EVENTS_;
    });
  });

  beforeEach(function() {
    ticketId = '123';
  });

  describe('The create function', function() {
    it('should reject if there is no ticket is provided', function(done) {
      TicketingTicketService.create()
        .catch(function(err) {
          expect(err.message).to.equal('Ticket is required');
          done();
        });
      $rootScope.$digest();
    });

    it('should reject if failed to create ticket', function() {
      var ticket = { foo: 'bar' };

      TicketingTicketClient.create = sinon.stub().returns($q.reject());
      TicketingTicketService.create(ticket);
      $rootScope.$digest();

      expect(TicketingTicketClient.create).to.have.been.calledWith(ticket);
    });

    it('should fire an event if success to create ticket', function() {
      var ticket = { foo: 'bar' };

      TicketingTicketClient.create = sinon.stub().returns($q.when({ data: ticket }));
      $rootScope.$broadcast = sinon.spy();
      TicketingTicketService.create(ticket);
      $rootScope.$digest();

      expect(TicketingTicketClient.create).to.have.been.calledWith(ticket);
      expect($rootScope.$broadcast).to.have.been.calledWith(TICKETING_TICKET_EVENTS.CREATED, ticket);
    });
  });

  describe('The get function', function() {
    it('should reject if failed to get ticket', function(done) {
      TicketingTicketClient.get = sinon.stub().returns($q.reject());

      TicketingTicketService.get()
        .catch(function() {
          expect(TicketingTicketClient.get).to.have.been.calledOnce;
          done();
        });

      $rootScope.$digest();
    });

    it('should resolve if success to get ticket', function(done) {
      var ticket = {
        requester: { firstname: 'firstname', lastname: 'lastname' },
        attachments: [{ filename: 'filename' }]
      };

      TicketingTicketClient.get = sinon.stub().returns($q.when({ data: ticket }));

      TicketingTicketService.get()
        .then(function(result) {
          expect(TicketingTicketClient.get).to.have.been.calledOnce;
          expect(result).to.deep.equal({
            requester: { firstname: 'firstname', lastname: 'lastname', displayName: 'firstname lastname' },
            attachments: [{ filename: 'filename', name: 'filename' }],
            supportTechnicians: []
          });
          done();
        })
        .catch(function(err) {
          done(err || 'should resolve');
        });

      $rootScope.$digest();
    });
  });

  describe('The updateState function', function() {
    it('should reject if there is no ticketId is provided', function(done) {
      TicketingTicketService.updateState()
        .catch(function(err) {
          expect(err.message).to.equal('ticketId is required');
          done();
        });
      $rootScope.$digest();
    });

    it('should reject if there is no state is provided', function(done) {
      TicketingTicketService.updateState(ticketId)
        .catch(function(err) {
          expect(err.message).to.equal('state is required');
          done();
        });
      $rootScope.$digest();
    });

    it('should reject if failed to update state', function(done) {
      var error = new Error('something wrong');
      var newState = 'In progress';

      TicketingTicketClient.updateState = sinon.stub().returns($q.reject(error));

      TicketingTicketService.updateState(ticketId, newState)
        .catch(function(err) {
          expect(TicketingTicketClient.updateState).to.have.been.calledWith(ticketId, newState);
          expect(err.message).to.equal(error.message);
          done();
        });
      $rootScope.$digest();
    });

    it('should resolve if success to update state', function(done) {
      var newState = 'In progress';
      var ticket = {
        _id: '123',
        state: newState
      };

      TicketingTicketClient.updateState = sinon.stub().returns($q.when({ data: ticket }));

      TicketingTicketService.updateState(ticket._id, newState)
        .then(function(result) {
          expect(TicketingTicketClient.updateState).to.have.been.calledWith(ticket._id, newState);
          expect(result).to.deep.equal(ticket);
          done();
        })
        .catch(function(err) {
          done(err || 'should resolve');
        });

      $rootScope.$digest();
    });
  });

  describe('The setWorkaroundTime function', function() {
    it('should reject if there is no ticketId is provided', function(done) {
      TicketingTicketService.setWorkaroundTime()
        .catch(function(err) {
          expect(err.message).to.equal('ticketId is required');
          done();
        });
      $rootScope.$digest();
    });

    it('should reject if failed to set workaround time', function(done) {
      var error = new Error('something wrong');
      var ticketId = '123';

      TicketingTicketClient.setWorkaroundTime = sinon.stub().returns($q.reject(error));

      TicketingTicketService.setWorkaroundTime(ticketId)
        .catch(function(err) {
          expect(TicketingTicketClient.setWorkaroundTime).to.have.been.calledWith(ticketId);
          expect(err.message).to.equal(error.message);
          done();
        });
      $rootScope.$digest();
    });

    it('should resolve if success to set workaround time', function(done) {
      var ticket = {
        _id: '123',
        times: { creation: '2017', workaround: 6 }
      };

      TicketingTicketClient.setWorkaroundTime = sinon.stub().returns($q.when({ data: ticket }));

      TicketingTicketService.setWorkaroundTime(ticket._id)
        .then(function(result) {
          expect(TicketingTicketClient.setWorkaroundTime).to.have.been.calledWith(ticket._id);
          expect(result).to.deep.equal(ticket);
          done();
        })
        .catch(function(err) {
          done(err || 'should resolve');
        });

      $rootScope.$digest();
    });
  });

  describe('The unsetWorkaroundTime function', function() {
    it('should reject if there is no ticketId is provided', function(done) {
      TicketingTicketService.unsetWorkaroundTime()
        .catch(function(err) {
          expect(err.message).to.equal('ticketId is required');
          done();
        });
      $rootScope.$digest();
    });

    it('should reject if failed to unset workaround time', function(done) {
      var error = new Error('something wrong');
      var ticketId = '123';

      TicketingTicketClient.unsetWorkaroundTime = sinon.stub().returns($q.reject(error));

      TicketingTicketService.unsetWorkaroundTime(ticketId)
        .catch(function(err) {
          expect(TicketingTicketClient.unsetWorkaroundTime).to.have.been.calledWith(ticketId);
          expect(err.message).to.equal(error.message);
          done();
        });
      $rootScope.$digest();
    });

    it('should resolve if success to unset workaround time', function(done) {
      var ticket = {
        _id: '123',
        times: { creation: '2017' }
      };

      TicketingTicketClient.unsetWorkaroundTime = sinon.stub().returns($q.when({ data: ticket }));

      TicketingTicketService.unsetWorkaroundTime(ticket._id)
        .then(function(result) {
          expect(TicketingTicketClient.unsetWorkaroundTime).to.have.been.calledWith(ticket._id);
          expect(result).to.deep.equal(ticket);
          done();
        })
        .catch(function(err) {
          done(err || 'should resolve');
        });

      $rootScope.$digest();
    });
  });

  describe('The setCorrectionTime function', function() {
    it('should reject if there is no ticketId is provided', function(done) {
      TicketingTicketService.setCorrectionTime()
        .catch(function(err) {
          expect(err.message).to.equal('ticketId is required');
          done();
        });
      $rootScope.$digest();
    });

    it('should reject if failed to set correction time', function(done) {
      var error = new Error('something wrong');
      var ticketId = '123';

      TicketingTicketClient.setCorrectionTime = sinon.stub().returns($q.reject(error));

      TicketingTicketService.setCorrectionTime(ticketId)
        .catch(function(err) {
          expect(TicketingTicketClient.setCorrectionTime).to.have.been.calledWith(ticketId);
          expect(err.message).to.equal(error.message);
          done();
        });
      $rootScope.$digest();
    });

    it('should resolve if success to set correction time', function(done) {
      var ticket = {
        _id: '123',
        times: { creation: '2017', correction: 6 }
      };

      TicketingTicketClient.setCorrectionTime = sinon.stub().returns($q.when({ data: ticket }));

      TicketingTicketService.setCorrectionTime(ticket._id)
        .then(function(result) {
          expect(TicketingTicketClient.setCorrectionTime).to.have.been.calledWith(ticket._id);
          expect(result).to.deep.equal(ticket);
          done();
        })
        .catch(function(err) {
          done(err || 'should resolve');
        });

      $rootScope.$digest();
    });
  });

  describe('The unsetCorrectionTime function', function() {
    it('should reject if there is no ticketId is provided', function(done) {
      TicketingTicketService.unsetCorrectionTime()
        .catch(function(err) {
          expect(err.message).to.equal('ticketId is required');
          done();
        });
      $rootScope.$digest();
    });

    it('should reject if failed to unset correction time', function(done) {
      var error = new Error('something wrong');
      var ticketId = '123';

      TicketingTicketClient.unsetCorrectionTime = sinon.stub().returns($q.reject(error));

      TicketingTicketService.unsetCorrectionTime(ticketId)
        .catch(function(err) {
          expect(TicketingTicketClient.unsetCorrectionTime).to.have.been.calledWith(ticketId);
          expect(err.message).to.equal(error.message);
          done();
        });
      $rootScope.$digest();
    });

    it('should resolve if success to unset correction time', function(done) {
      var ticket = {
        _id: '123',
        times: { creation: '2017' }
      };

      TicketingTicketClient.unsetCorrectionTime = sinon.stub().returns($q.when({ data: ticket }));

      TicketingTicketService.unsetCorrectionTime(ticket._id)
        .then(function(result) {
          expect(TicketingTicketClient.unsetCorrectionTime).to.have.been.calledWith(ticket._id);
          expect(result).to.deep.equal(ticket);
          done();
        })
        .catch(function(err) {
          done(err || 'should resolve');
        });

      $rootScope.$digest();
    });
  });
});
