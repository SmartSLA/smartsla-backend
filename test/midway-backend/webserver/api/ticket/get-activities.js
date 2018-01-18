'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;

describe('GET /ticketing/api/tickets/:id/activities', function() {
  let app, lib, helpers, ObjectId, apiUrl;
  let user1, user2, ticket;
  const password = 'secret';

  beforeEach(function(done) {
    helpers = this.helpers;
    app = this.app;
    lib = this.lib;
    ObjectId = this.testEnv.core.db.mongo.mongoose.Types.ObjectId;

    const deployOptions = {
      fixtures: path.normalize(`${__dirname}/../../../fixtures/deployments`)
    };

    helpers.api.applyDomainDeployment('ticketingModule', deployOptions, (err, models) => {
      if (err) {
        return done(err);
      }

      user1 = models.users[1];
      user2 = models.users[2];

      lib.ticketingUserRole.create({
        user: user1._id,
        role: 'administrator'
      })
      .then(() =>
        lib.ticketingUserRole.create({
          user: user2._id,
          role: 'user'
        })
      )
      .then(() => done())
      .catch(err => done(err));
    });
  });

  beforeEach(function(done) {
    lib.ticket.create({
      contract: new ObjectId(),
      title: 'ticket 1',
      demandType: 'demandType',
      description: 'This is description of ticket with length is 58 characters',
      requester: user1._id,
      supportManager: user1._id,
      supportTechnicians: [user1._id]
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

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get(apiUrl));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
          });
          done();
        }));
    }));
  });
});
