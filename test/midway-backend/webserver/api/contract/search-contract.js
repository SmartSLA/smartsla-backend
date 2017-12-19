'use strict';

const request = require('supertest');
const path = require('path');
const Q = require('q');
const expect = require('chai').expect;

describe('GET /ticketing/api/contracts?search=', function() {
  let app, lib, helpers;
  let user1, user2, organization, esIntervalIndex;
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

      done();
    });
  });

  beforeEach(function(done) {
    lib.ticketingUserRole.create({
      user: user1._id,
      role: 'administrator'
    })
    .then(() =>
      lib.ticketingUserRole.create({
        user: user2._id,
        role: 'user'
      }))
    .then(() =>
      lib.organization.create({
        shortName: 'organization'
      })
      .then(createdOrganization => (organization = createdOrganization)))
    .then(() => done())
    .catch(err => done(err));
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(err => done(err));
  });

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'get', '/ticketing/api/contracts?search=a', done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get('/ticketing/api/contracts?search=a'));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
          });
          done();
        }));
    }));
  });

  it('should respond 200 with the contracts list in alphabetic order of title', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const contractA = {
        title: 'fooz',
        organization: organization._id,
        startDate: new Date(),
        endDate: new Date()
      };
      const contractB = {
        title: 'bar',
        organization: organization._id,
        startDate: new Date(),
        endDate: new Date()
      };
      const contractC = {
        title: 'foo',
        organization: organization._id,
        startDate: new Date(),
        endDate: new Date()
      };

      Q.all([
        lib.contract.create(contractA),
        lib.contract.create(contractB),
        lib.contract.create(contractC)
      ]).then(() => {
        setTimeout(function() {
          const req = requestAsMember(request(app).get('/ticketing/api/contracts?search=foo'));

          req.expect(200)
            .end(helpers.callbacks.noErrorAnd(res => {
              expect(res.headers['x-esn-items-count']).to.exist;
              expect(res.headers['x-esn-items-count']).to.equal('2');
              expect(res.body[0].title).to.equal(contractC.title);
              expect(res.body[1].title).to.equal(contractA.title);
              done();
            }));
          }, esIntervalIndex);
        });
    }));
  });
});
