'use strict';

const request = require('supertest');
const Q = require('q');
const path = require('path');
const expect = require('chai').expect;
const MODULE_NAME = 'linagora.esn.ticketing';
const { INDICES } = require('../../../../../backend/lib/constants');

describe('POST /api/organizations', function() {
  let app, lib, helpers;
  let user1, user2;
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

  it('should respond 400 if there is no shortName in payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post('/api/organizations'));
      const newOrganization = {
        foo: 'baz'
      };

      req.send(newOrganization);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'shortName is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if manager is invalid', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post('/api/organizations'));
      const newOrganization = {
        shortName: 'baz',
        manager: 'wrong_objectId'
      };

      req.send(newOrganization);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'manager is invalid' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if shortName is taken', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post('/api/organizations'));

        lib.organization.create({
          shortName: 'organization'
        })
        .then(createdOrganization => {
          const newOrganization = {
            shortName: createdOrganization.shortName
          };

          req.send(newOrganization);
          req.expect(400)
            .end(helpers.callbacks.noErrorAnd(res => {
              expect(res.body).to.deep.equal({
                error: { code: 400, message: 'Bad Request', details: 'shortName is taken' }
              });
              done();
            }));
        });
    }));
  });

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'post', '/api/organizations', done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post('/api/organizations'));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
          });
          done();
        }));
    }));
  });

  it('should respond 201 if create organization successfully', function(done) {
      helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const newOrganization = {
          shortName: 'new'
        };
        const req = requestAsMember(request(app).post('/api/organizations'));

        function checkOrganizationsIndexed(organizations) {
          const options = {
            index: INDICES.ORGANIZATION.name,
            type: INDICES.ORGANIZATION.type,
            ids: organizations.map(organization => organization._id)
          };

          return Q.nfapply(helpers.elasticsearch.checkDocumentsIndexed, [options]);
        }

        function test(created) {
          checkOrganizationsIndexed(created).then(function() {
            done();
          }, done);
        }

        req.send(newOrganization);
        req.expect(201)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.body.shortName).to.equal(newOrganization.shortName);
            test([res.body]);
          }));
      }));
    });
});
