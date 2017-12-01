'use strict';

const request = require('supertest');
const Q = require('q');
const path = require('path');
const expect = require('chai').expect;
const MODULE_NAME = 'linagora.esn.ticketing';

describe('GET /api/software?search=', function() {
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
    helpers.api.requireLogin(app, 'get', '/api/software?search=a', done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get('/api/software?search=a'));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
          });
          done();
        }));
    }));
  });

  it('should respond 200 if search software successfully', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const softwareA = { name: 'foo', category: 'test' };
      const softwareB = { name: 'bar', category: 'test' };
      const req = requestAsMember(request(app).get(`/api/software?search=${softwareA.name}`));

      Q.all([
        lib.software.create(softwareA),
        lib.software.create(softwareB)
      ]).then(() => {
        setTimeout(function() {
          req.expect(200)
            .end(helpers.callbacks.noErrorAnd(res => {
              expect(res.headers['x-esn-items-count']).to.exist;
              expect(res.headers['x-esn-items-count']).to.equal('1');
              expect(res.body[0].name).to.shallowDeepEqual(softwareA.name);
              done();
            }));
          }, esIntervalIndex);
        });
    }));
  });

  it('should respond 200 with the software list in alphabetic order of name', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const softwareA = { name: 'fooB', category: 'test' };
      const softwareB = { name: 'bar', category: 'test' };
      const softwareC = { name: 'fooA', category: 'test' };
      const req = requestAsMember(request(app).get('/api/software?search=foo'));

      Q.all([
        lib.software.create(softwareA),
        lib.software.create(softwareB),
        lib.software.create(softwareC)
      ]).then(() => {
        setTimeout(function() {
          req.expect(200)
            .end(helpers.callbacks.noErrorAnd(res => {
              expect(res.headers['x-esn-items-count']).to.exist;
              expect(res.headers['x-esn-items-count']).to.equal('2');
              expect(res.body[0].name).to.shallowDeepEqual(softwareC.name);
              expect(res.body[1].name).to.shallowDeepEqual(softwareA.name);
              done();
            }));
          }, esIntervalIndex);
        });
    }));
  });

  it('should respond 200 with the software list which does not include excluded software ids', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const softwareJsonA = { name: 'fooA', category: 'test' };
      const softwareJsonB = { name: 'fooB', category: 'test' };
      let softwareA;

      lib.software.create(softwareJsonA)
        .then(createdSoftware => {
          softwareA = createdSoftware;

          return lib.software.create(softwareJsonB);
        })
        .then(() => {
          const req = requestAsMember(request(app).get(`/api/software?search=foo&&excludedIds[]=${softwareA.id}`));

          setTimeout(function() {
            req.expect(200)
              .end(helpers.callbacks.noErrorAnd(res => {
                expect(res.headers['x-esn-items-count']).to.exist;
                expect(res.headers['x-esn-items-count']).to.equal('1');
                expect(res.body[0].name).to.shallowDeepEqual(softwareJsonB.name);
                done();
              }));
            }, esIntervalIndex);
        });
    }));
  });
});
