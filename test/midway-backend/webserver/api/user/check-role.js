'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;
const MODULE_NAME = 'linagora.esn.ticketing';

describe('GET /api/users/:id/isadministrator', function() {
  let app, lib, helpers;
  let user0, user1, user2;
  const password = 'secret';

  beforeEach(function(done) {
    const self = this;

    helpers = self.helpers;

    helpers.modules.initMidway(MODULE_NAME, function(err) {
      if (err) {
        return done(err);
      }
      const ticketingApp = require(self.testEnv.backendPath + '/webserver/application')(helpers.modules.current.deps);
      const api = require(self.testEnv.backendPath + '/webserver/api')(helpers.modules.current.deps, helpers.modules.current.lib.lib);

      ticketingApp.use(require('body-parser').json());
      ticketingApp.use('/api', api);

      app = helpers.modules.getWebServer(ticketingApp);
      const deployOptions = {
        fixtures: path.normalize(`${__dirname}/../../../fixtures/deployments`)
      };

      helpers.api.applyDomainDeployment('ticketingModule', deployOptions, function(err, models) {
        if (err) {
          return done(err);
        }

        user0 = models.users[0];
        user1 = models.users[1];
        user2 = models.users[2];
        lib = helpers.modules.current.lib.lib;

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
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(done);
  });

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'get', `/api/users/${user1._id}/isadministrator`, done);
  });

  it('should respond 403 if user does not have permission to access Ticketing', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get(`/api/users/${user0._id}/isadministrator`));

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
      const req = requestAsMember(request(app).get('/api/users/invalid_objectid/isadministrator'));

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
      const req = requestAsMember(request(app).get(`/api/users/${user1._id}/isadministrator`));

      req.expect(200)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.be.true;
          done();
        }));
    }));
  });

  it('should respond 200 with false if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get(`/api/users/${user2._id}/isadministrator`));

      req.expect(200)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.be.false;
          done();
        }));
    }));
  });
});
