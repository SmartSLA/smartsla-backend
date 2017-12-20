'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;

describe('GET /ticketing/api/glossaries', function() {
  const API_PATH = '/ticketing/api/glossaries';
  let app, lib, helpers;
  let user1, user2, glossary;
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

      lib.ticketingUserRole.create({
        user: user1._id,
        role: 'administrator'
      })
      .then(() =>
        lib.ticketingUserRole.create({
          user: user2._id,
          role: 'user'
        })
      )
      .then(() =>
        lib.glossary.create({
          word: 'foo',
          category: 'Demand type'
        })
        .then(createdGlossary => {
          glossary = createdGlossary;
          done();
        })
      )
      .catch(err => done(err));
    });
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(err => done(err));
  });

  function getObjectFromModel(document) {
    return JSON.parse(JSON.stringify(document)); // Because model object use original type like Bson, Date
  }

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'get', API_PATH, done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get(API_PATH));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
          });
          done();
        }));
    }));
  });

  it('should respond 200 if list glossaries successfully', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get(API_PATH));
      const expectResult = [getObjectFromModel(glossary)];

      req.expect(200)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.headers['x-esn-items-count']).to.exist;
          expect(res.headers['x-esn-items-count']).to.equal(`${expectResult.length}`);
          expect(res.body).to.shallowDeepEqual(expectResult);
          done();
        }));
    }));
  });

  it('should respond 200 with the list glossaries of given category', function(done) {
    lib.glossary.create({
      word: 'zfoo',
      category: 'Software type'
    })
    .then(createdRequest => {
      helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).get(API_PATH));
        const expectResult = [getObjectFromModel(createdRequest)];

        req.query({ category: 'Software type' });
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

  it('should respond 200 with the list glossaries in alphabetic order of word', function(done) {
    lib.glossary.create({
      word: 'zfoo',
      category: 'Software type'
    })
    .then(createdRequest => {
      helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).get(API_PATH));
        const expectResult = [getObjectFromModel(glossary), getObjectFromModel(createdRequest)];

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
