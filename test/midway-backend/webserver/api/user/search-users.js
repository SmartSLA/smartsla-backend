'use strict';

const Q = require('q');
const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;

describe('GET /ticketing/api/users?search=', function() {
  let app, lib, helpers, esIntervalIndex;
  let user1, user2;
  const password = 'secret';

  beforeEach(function(done) {
    helpers = this.helpers;
    app = this.app;
    lib = this.lib;
    esIntervalIndex = this.testEnv.serversConfig.elasticsearch.interval_index;

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
      .then(() =>
        lib.ticketingUserRole.create({
          user: user2._id,
          role: 'user'
        }))
      .then(() => { done(); })
      .catch(err => done(err));
    });
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(err => done(err));
  });

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'get', '/ticketing/api/users?search=abc', done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get('/ticketing/api/users?search=abc'));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
          });
          done();
        }));
    }));
  });

  it('should respond 200 with the list of users in alphabetic order of firstname', function(done) {
    const userAJson = {
      firstname: 'fooZZZZZZZZ',
      lastname: 'userA lastname',
      accounts: [{
        type: 'email',
        emails: ['usera@tic.org'],
        hosted: true
      }],
      main_phone: '3333'
    };
    const userBJson = {
      firstname: 'fooCCCCCCC',
      lastname: 'userB lastname',
      accounts: [{
        type: 'email',
        emails: ['userb@tic.org'],
        hosted: true
      }],
      main_phone: '4444'
    };

    Q.all([
      lib.user.create(userAJson),
      lib.user.create(userBJson)
    ]).then(() => {
      setTimeout(function() {
        helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
          const req = requestAsMember(request(app).get('/ticketing/api/users?search=foo'));

          req.expect(200)
            .end(helpers.callbacks.noErrorAnd(res => {
              expect(res.headers['x-esn-items-count']).to.equal('2');
              expect(res.body[0].firstname).to.equal(userBJson.firstname);
              expect(res.body[1].firstname).to.equal(userAJson.firstname);
              done();
            }));
        }));
      }, esIntervalIndex);
    });
  });

  it('should respond 200 with list of users which have role', function(done) {
    const userAJson = {
      firstname: 'fooZZZZZZZZ',
      lastname: 'userA lastname',
      accounts: [{
        type: 'email',
        emails: ['usera@tic.org'],
        hosted: true
      }],
      main_phone: '3333',
      role: 'user'
    };
    const userBJson = {
      firstname: 'fooCCCCCCC',
      lastname: 'userB lastname',
      accounts: [{
        type: 'email',
        emails: ['userb@tic.org'],
        hosted: true
      }],
      main_phone: '4444',
      role: 'supporter'
    };

    Q.all([
      lib.user.create(userAJson),
      lib.user.create(userBJson)
    ]).then(() => {
      setTimeout(function() {
        helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
          const req = requestAsMember(request(app).get('/ticketing/api/users?search=foo&&role=supporter'));

          req.expect(200)
            .end(helpers.callbacks.noErrorAnd(res => {
              expect(res.headers['x-esn-items-count']).to.equal('1');
              expect(res.body[0].firstname).to.equal(userBJson.firstname);
              done();
            }));
        }));
      }, esIntervalIndex);
    });
  });
});
