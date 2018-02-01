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

  describe('The response, workaround, correction times fields', function() {
    it('should not store the ticket which has workaround time smaller than response time', function(done) {
      saveTicket({
        title: 'foo',
        contract: new ObjectId(),
        demandType: 'info',
        // minlength = 50
        description: 'fooooooooooooooooooooooooooooooooooooooooooooooooo',
        requester: new ObjectId(),
        supportManager: new ObjectId(),
        times: {
          response: 2,
          workaround: 1
        }
      }, err => {
        expect(err).to.exist;
        expect(err.message).to.equal('workaround time can NOT be smaller than response time');
        done();
      });
    });

    it('should not store the ticket which has correction smaller than response time', function(done) {
      saveTicket({
        title: 'foo',
        contract: new ObjectId(),
        demandType: 'info',
        // minlength = 50
        description: 'fooooooooooooooooooooooooooooooooooooooooooooooooo',
        requester: new ObjectId(),
        supportManager: new ObjectId(),
        times: {
          response: 2,
          correction: 1
        }
      }, err => {
        expect(err).to.exist;
        expect(err.message).to.equal('correction time can NOT be smaller than response time');
        done();
      });
    });

    it('should not store the ticket which has correction time smaller than workaround time', function(done) {
      saveTicket({
        title: 'foo',
        contract: new ObjectId(),
        demandType: 'info',
        // minlength = 50
        description: 'fooooooooooooooooooooooooooooooooooooooooooooooooo',
        requester: new ObjectId(),
        supportManager: new ObjectId(),
        times: {
          workaround: 2,
          correction: 1
        }
      }, err => {
        expect(err).to.exist;
        expect(err.message).to.equal('correction time can NOT be smaller than workaround time');
        done();
      });
    });
  });
});
