'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;

describe('GET /ticketing/api/users/:id/isadministrator', function() {
  let app, lib, helpers;
  let user0, user1, user2;
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

      user0 = models.users[0];
      user1 = models.users[1];
      user2 = models.users[2];

      lib.ticketingUserRole.create({
        user: user1._id,
        role: 'administrator'
      })
      .then(() => {
        lib.ticketingUserRole.create({
          user: user2._id,
          role: 'user'
        });
      })
      .then(() => done())
      .catch(err => done(err));
    });
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(err => done(err));
  });

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'get', `/ticketing/api/users/${user1._id}/isadministrator`, done);
  });

  it('should respond 403 if user does not have permission to access Ticketing', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get(`/ticketing/api/users/${user0._id}/isadministrator`));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: 'User does not have permission to access Ticketing' }
          });
          done();
        }));
    }));
  });

  it('should respond 404 if there is user id is invalid', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get('/ticketing/api/users/invalid_objectid/isadministrator'));

      req.expect(404)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 404, message: 'Not Found', details: 'User not found' }
          });
          done();
        }));
    }));
  });

  it('should respond 200 with true if user is an administrator', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get(`/ticketing/api/users/${user1._id}/isadministrator`));

      req.expect(200)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.be.true;
          done();
        }));
    }));
  });

  it('should respond 200 with false if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get(`/ticketing/api/users/${user2._id}/isadministrator`));

      req.expect(200)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.be.false;
          done();
        }));
    }));
  });
});
