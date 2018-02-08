'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;

describe('GET /ticketing/api/user/role', function() {
  let app, lib, helpers;
  let user1, user2;
  const password = 'secret';

  beforeEach(function(done) {
    helpers = this.helpers;
    app = this.app;
    lib = this.lib;

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
      .then(() => done())
      .catch(err => done(err));
    });
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(err => done(err));
  });

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'get', '/ticketing/api/user/role', done);
  });

  it('should respond 404 if user not found', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get('/ticketing/api/user/role'));

      req.expect(404)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 404, message: 'Not Found', details: 'User not found' }
          });
          done();
        }));
    }));
  });

  it('should respond 200 with user role', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get('/ticketing/api/user/role'));

      req.expect(200)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.equal('administrator');
          done();
        }));
    }));
  });
});
