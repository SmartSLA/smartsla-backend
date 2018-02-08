'use strict';

const request = require('supertest');
const expect = require('chai').expect;

describe('GET /ticketing/api/tickets/:id/activities', function() {
  let app, lib, helpers, ObjectId, apiUrl;
  let supporter, user1, user2, ticket;
  const password = 'secret';

  beforeEach(function(done) {
    helpers = this.helpers;
    app = this.app;
    lib = this.lib;
    ObjectId = this.testEnv.core.db.mongo.mongoose.Types.ObjectId;

    const fixtures = require('../../../fixtures/deployments');

    helpers.initUsers(fixtures.ticketingUsers())
      .then(createdUsers => {
        supporter = createdUsers[1];
        user1 = createdUsers[2];
        user2 = createdUsers[3];
        done();
      })
      .catch(err => done(err));
  });

  beforeEach(function(done) {
    lib.ticket.create({
      contract: new ObjectId(),
      title: 'ticket 1',
      demandType: 'demandType',
      description: 'This is description of ticket with length is 58 characters',
      requester: user1._id,
      supportManager: supporter._id,
      supportTechnicians: [supporter._id]
    })
    .then(createdTicket => {
      ticket = createdTicket;
      apiUrl = `/ticketing/api/tickets/${ticket._id}/activities`;
      done();
    })
    .catch(err => done(err));
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(err => done(err));
  });

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'get', apiUrl, done);
  });

  it('should respond 403 if user is not the ticket\'s requester', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get(apiUrl));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: `User does not have permission to read ticket: ${ticket._id}` }
          });
          done();
        }));
    }));
  });
});
