'use strict';

const request = require('supertest');
const Q = require('q');
const path = require('path');
const expect = require('chai').expect;

describe('GET /ticketing/api/software?search=', function() {
  let app, lib, helpers, esIntervalIndex;
  let user1, user2;
  const password = 'secret';

  beforeEach(function(done) {
    helpers = this.helpers;
    esIntervalIndex = this.testEnv.serversConfig.elasticsearch.interval_index;
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
    helpers.api.requireLogin(app, 'get', '/ticketing/api/software?search=a', done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get('/ticketing/api/software?search=a'));

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
      const req = requestAsMember(request(app).get(`/ticketing/api/software?search=${softwareA.name}`));

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
      const req = requestAsMember(request(app).get('/ticketing/api/software?search=foo'));

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
          const req = requestAsMember(request(app).get(`/ticketing/api/software?search=foo&&excludedIds[]=${softwareA.id}`));

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
