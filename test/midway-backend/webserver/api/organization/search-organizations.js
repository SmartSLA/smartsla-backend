'use strict';

const request = require('supertest');
const Q = require('q');
const path = require('path');
const expect = require('chai').expect;
const MODULE_NAME = 'linagora.esn.ticketing';

describe('GET /api/organizations?search=', function() {
  let app, lib, helpers, esIntervalIndex;
  let user1, user2;
  const password = 'secret';

  beforeEach(function(done) {
    const self = this;

    helpers = self.helpers;
    esIntervalIndex = self.testEnv.serversConfig.elasticsearch.interval_index;

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

        lib.start(err => {
          if (err) {
            done(err);
          }

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
  });

  afterEach(function(done) {
    this.helpers.mongo.dropDatabase(err => {
      if (err) return done(err);
      this.testEnv.core.db.mongo.mongoose.connection.close(done);
    });
  });

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'get', '/api/organizations?search=a', done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get('/api/organizations?search=a'));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
          });
          done();
        }));
    }));
  });

  it('should respond 200 if search organizations successfully', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const organizationA = { shortName: 'foo' };
      const organizationB = { shortName: 'bar' };
      const req = requestAsMember(request(app).get(`/api/organizations?search=${organizationA.shortName}`));

      Q.all([
        lib.organization.create(organizationA),
        lib.organization.create(organizationB)
      ]).then(() => {
        setTimeout(function() {
          req.expect(200)
            .end(helpers.callbacks.noErrorAnd(res => {
              expect(res.headers['x-esn-items-count']).to.exist;
              expect(res.headers['x-esn-items-count']).to.equal('1');
              expect(res.body[0].shortName).to.shallowDeepEqual(organizationA.shortName);
              done();
            }));
          }, esIntervalIndex);
        });
    }));
  });

  it('should respond 200 with only list of organizations if there is no parent is provided', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const organizationA = { shortName: 'foo' };

      lib.organization.create(organizationA)
        .then(createdOrganization => {
          const organizationB = { shortName: 'foo foo', parent: createdOrganization._id };
          const organizationC = { shortName: 'lin', parent: createdOrganization._id };

          Q.all([
            lib.organization.create(organizationB),
            lib.organization.create(organizationC)
          ]).then(() => {
            const req = requestAsMember(request(app).get('/api/organizations?search=foo'));

            setTimeout(function() {
              req.expect(200)
                .end(helpers.callbacks.noErrorAnd(res => {
                  expect(res.headers['x-esn-items-count']).to.exist;
                  expect(res.headers['x-esn-items-count']).to.equal('1');
                  expect(res.body[0].shortName).to.shallowDeepEqual(organizationA.shortName);
                  done();
                }));
              }, esIntervalIndex);
            });
        });
    }));
  });

  it('should respond 200 with only list of entites if parent is provided', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const organizationA = { shortName: 'foo' };

      lib.organization.create(organizationA)
        .then(createdOrganization => {
          const organizationB = { shortName: 'foo foo', parent: createdOrganization._id };
          const organizationC = { shortName: 'lin', parent: createdOrganization._id };

          Q.all([
            lib.organization.create(organizationB),
            lib.organization.create(organizationC)
          ]).then(() => {
            const req = requestAsMember(request(app).get('/api/organizations?search=foo&&parent=true'));

            setTimeout(function() {
              req.expect(200)
                .end(helpers.callbacks.noErrorAnd(res => {
                  expect(res.headers['x-esn-items-count']).to.exist;
                  expect(res.headers['x-esn-items-count']).to.equal('1');
                  expect(res.body[0].shortName).to.shallowDeepEqual(organizationB.shortName);
                  done();
                }));
              }, esIntervalIndex);
            });
        });
    }));
  });
});
