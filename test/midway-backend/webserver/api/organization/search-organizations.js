'use strict';

const request = require('supertest');
const Q = require('q');
const path = require('path');
const expect = require('chai').expect;

describe('GET /ticketing/api/organizations?search=', function() {
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
    helpers.api.requireLogin(app, 'get', '/ticketing/api/organizations?search=a', done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get('/ticketing/api/organizations?search=a'));

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
      const req = requestAsMember(request(app).get(`/ticketing/api/organizations?search=${organizationA.shortName}`));

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

  it('should respond 200 with the organizations list in alphabetic order of shortName', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const organizationA = { shortName: 'fooB' };
      const organizationB = { shortName: 'bar' };
      const organizationC = { shortName: 'fooA' };
      const req = requestAsMember(request(app).get('/ticketing/api/organizations?search=foo'));

      Q.all([
        lib.organization.create(organizationA),
        lib.organization.create(organizationB),
        lib.organization.create(organizationC)
      ]).then(() => {
        setTimeout(function() {
          req.expect(200)
            .end(helpers.callbacks.noErrorAnd(res => {
              expect(res.headers['x-esn-items-count']).to.exist;
              expect(res.headers['x-esn-items-count']).to.equal('2');
              expect(res.body[0].shortName).to.shallowDeepEqual(organizationC.shortName);
              expect(res.body[1].shortName).to.shallowDeepEqual(organizationA.shortName);
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
            const req = requestAsMember(request(app).get('/ticketing/api/organizations?search=foo'));

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
            const req = requestAsMember(request(app).get('/ticketing/api/organizations?search=foo&&parent=true'));

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
