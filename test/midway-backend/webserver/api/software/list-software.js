'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;

describe('GET /ticketing/api/software', function() {
  let app, lib, helpers;
  let user1, user2, software;
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
    .then(() => {
      lib.ticketingUserRole.create({
        user: user2._id,
        role: 'user'
      });
    })
    .then(() => {
      lib.software.create({
        name: 'foo',
        category: 'foz',
        versions: ['1']
      })
      .then(createdSofware => {
        software = createdSofware;
        done();
      });
    })
    .catch(err => done(err));
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(err => done(err));
  });

  function getObjectFromModel(document) {
    return JSON.parse(JSON.stringify(document)); // Because model object use original type like Bson, Date
  }

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'get', '/ticketing/api/software', done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get('/ticketing/api/software'));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
          });
          done();
        }));
    }));
  });

  it('should respond 200 if list software successfully', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get('/ticketing/api/software'));
      const expectResult = [getObjectFromModel(software)];

      req.expect(200)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.headers['x-esn-items-count']).to.exist;
          expect(res.headers['x-esn-items-count']).to.equal(`${expectResult.length}`);
          expect(res.body).to.shallowDeepEqual(expectResult);
          done();
        }));
    }));
  });

  it('should respond 200 with the list contains only latest software if offset=0 and limit=1', function(done) {
    lib.software.create({
      name: 'bar',
      category: 'baz',
      versions: ['1']
    })
    .then(createdSoftware => {
      helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).get('/ticketing/api/software'));
        const expectResult = [getObjectFromModel(createdSoftware)];

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

  it('should respond 200 with the list contains only oldest software if offset=1', function(done) {
    lib.software.create({
      name: 'bar',
      category: 'baz',
      versions: ['1']
    })
    .then(() => {
      helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).get('/ticketing/api/software'));
        const expectResult = [getObjectFromModel(software)];

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
