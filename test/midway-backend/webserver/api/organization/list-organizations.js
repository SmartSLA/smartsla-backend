'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;
const MODULE_NAME = 'linagora.esn.ticketing';

describe('GET /api/organizations', function() {
  let app, lib, helpers;
  let user1, user2, organization;
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
        .then(() => {
          lib.organization.create({
            shortName: 'organization'
          })
          .then(createdOrganization => {
            organization = createdOrganization;
            done();
          });
        })
        .catch(err => done(err));
      });
    });
  });

  afterEach(function(done) {
    this.helpers.mongo.dropDatabase(err => {
      if (err) return done(err);
      this.testEnv.core.db.mongo.mongoose.connection.close(done);
    });
  });

  function getObjectFromModel(document) {
    return JSON.parse(JSON.stringify(document)); // Because model object use original type like Bson, Date
  }

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'get', '/api/organizations', done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get('/api/organizations'));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
          });
          done();
        }));
    }));
  });

  it('should respond 200 if list organizations successfully', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get('/api/organizations'));
      const expectResult = [getObjectFromModel(organization)];

      req.expect(200)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.headers['x-esn-items-count']).to.exist;
          expect(res.headers['x-esn-items-count']).to.equal(`${expectResult.length}`);
          expect(res.body).to.shallowDeepEqual(expectResult);
          done();
        }));
    }));
  });

  it('should respond 200 with the list contains only latest organization if offset=0 and limit=1', function(done) {
    lib.organization.create({
      shortName: 'organization2'
    })
    .then(createdOrganization => {
      helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).get('/api/organizations'));
        const expectResult = [getObjectFromModel(createdOrganization)];

        req.query({ offset: 0, limit: 1 });
        req.expect(200)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.headers['x-esn-items-count']).to.exist;
            expect(res.headers['x-esn-items-count']).to.equal(`${expectResult.length}`);
            expect(res.body).to.shallowDeepEqual(expectResult);
            done();
          }));
      }));
    }, err => done(err || 'should resolve'));
  });

  it('should respond 200 with the list contains only oldest organization if offset=1', function(done) {
    lib.organization.create({
      shortName: 'organization2'
    })
    .then(() => {
      helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).get('/api/organizations'));
        const expectResult = [getObjectFromModel(organization)];

        req.query({ offset: 1 });
        req.expect(200)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.headers['x-esn-items-count']).to.exist;
            expect(res.headers['x-esn-items-count']).to.equal(`${expectResult.length}`);
            expect(res.body).to.shallowDeepEqual(expectResult);
            done();
          }));
      }));
    }, err => done(err || 'should resolve'));
  });
});