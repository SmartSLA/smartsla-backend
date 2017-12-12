'use strict';

const chai = require('chai');
const expect = chai.expect;

describe('The Ticket model', function() {
  let Ticket, ObjectId, mongoose;

  beforeEach(function(done) {
    mongoose = this.moduleHelpers.dependencies('db').mongo.mongoose;
    ObjectId = mongoose.Types.ObjectId;

    require(this.testEnv.backendPath + '/lib/db/ticket')(this.moduleHelpers.dependencies);
    Ticket = mongoose.model('Ticket');

    this.connectMongoose(mongoose, done);
  });

  afterEach(function(done) {
    delete mongoose.connection.models.Ticket;
    this.helpers.mongo.dropDatabase(err => {
      if (err) return done(err);
      this.testEnv.core.db.mongo.mongoose.connection.close(done);
    });
  });

  function saveTicket(ticketJson, callback) {
    const ticket = new Ticket(ticketJson);

    return ticket.save(callback);
  }

  describe('The number field', function() {
    let ticketJson;

    beforeEach(function(done) {
      ticketJson = {
        title: 'foo',
        contract: new ObjectId(),
        demandType: 'info',
        // minlength = 50
        description: 'fooooooooooooooooooooooooooooooooooooooooooooooooo',
        requester: new ObjectId(),
        supportManager: new ObjectId()
      };

      done();
    });

    it('should start by 1', function(done) {
      saveTicket(ticketJson, (err, savedTicket) => {
        if (err) {
          done(err);
        }

        expect(savedTicket.number).to.equal(1);
        done();
      });
    });

    it('should increase automatically', function(done) {
      saveTicket(ticketJson, err => {
        if (err) {
          done(err);
        }

        saveTicket(ticketJson, (err, savedTicket) => {
          if (err) {
            done(err);
          }

          expect(savedTicket.number).to.equal(2);
          done();
        });
      });
    });
  });

  describe('The state field', function() {
    it('should not store the ticket which has invalid state', function(done) {
      saveTicket({
        title: 'foo',
        contract: new ObjectId(),
        demandType: 'info',
        // minlength = 50
        description: 'fooooooooooooooooooooooooooooooooooooooooooooooooo',
        requester: new ObjectId(),
        supportManager: new ObjectId(),
        state: 'not-supported'
      }, err => {
        expect(err).to.exist;
        expect(err.errors.state.message).to.equal('Invalid ticket state');
        done();
      });
    });
  });

  describe('The responseTime, workaroundTime, correctionTime fields', function() {
    it('should not store the ticket which has workaroundTime < responseTime', function(done) {
      saveTicket({
        title: 'foo',
        contract: new ObjectId(),
        demandType: 'info',
        // minlength = 50
        description: 'fooooooooooooooooooooooooooooooooooooooooooooooooo',
        requester: new ObjectId(),
        supportManager: new ObjectId(),
        responseTime: 2,
        workaroundTime: 1
      }, err => {
        expect(err).to.exist;
        expect(err.message).to.equal('workaroundTime can NOT be smaller than responseTime');
        done();
      });
    });

    it('should not store the ticket which has correctionTime < responseTime', function(done) {
      saveTicket({
        title: 'foo',
        contract: new ObjectId(),
        demandType: 'info',
        // minlength = 50
        description: 'fooooooooooooooooooooooooooooooooooooooooooooooooo',
        requester: new ObjectId(),
        supportManager: new ObjectId(),
        responseTime: 2,
        correctionTime: 1
      }, err => {
        expect(err).to.exist;
        expect(err.message).to.equal('correctionTime can NOT be smaller than responseTime');
        done();
      });
    });

    it('should not store the ticket which has correctionTime < workaroundTime', function(done) {
      saveTicket({
        title: 'foo',
        contract: new ObjectId(),
        demandType: 'info',
        // minlength = 50
        description: 'fooooooooooooooooooooooooooooooooooooooooooooooooo',
        requester: new ObjectId(),
        supportManager: new ObjectId(),
        workaroundTime: 2,
        correctionTime: 1
      }, err => {
        expect(err).to.exist;
        expect(err.message).to.equal('correctionTime can NOT be smaller than workaroundTime');
        done();
      });
    });
  });
});
