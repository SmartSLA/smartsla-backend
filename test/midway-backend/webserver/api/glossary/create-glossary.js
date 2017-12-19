'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;

describe('POST /ticketing/api/glossaries', function() {
  const API_PATH = '/ticketing/api/glossaries';
  let app, lib, helpers;
  let user1, user2;
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
      .then(() => done())
      .catch(err => done(err));
    });
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(err => done(err));
  });

  it('should respond 400 if there is no word in payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(API_PATH));
      const newGlossary = {
        category: 'Demand type'
      };

      req.send(newGlossary);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'word is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is no category in payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(API_PATH));
      const newGlossary = {
        word: 'foo'
      };

      req.send(newGlossary);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'category is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if category is not supported', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(API_PATH));
      const newGlossary = {
        word: 'foo',
        category: 'bar'
      };

      req.send(newGlossary);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'category is not supported' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if glossary already exists', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(API_PATH));

      lib.glossary.create({
        word: 'foo',
        category: 'Demand type'
      })
        .then(createdGlossary => {
          const newGlossary = {
            word: createdGlossary.word,
            category: createdGlossary.category
          };

          req.send(newGlossary);
          req.expect(400)
            .end(helpers.callbacks.noErrorAnd(res => {
              expect(res.body).to.deep.equal({
                error: { code: 400, message: 'Bad Request', details: `${createdGlossary.word} in ${createdGlossary.category} already exists` }
              });
              done();
            }));
        }, err => done(err || 'should resolve'));
    }));
  });

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'post', API_PATH, done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(API_PATH));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
          });
          done();
        }));
    }));
  });

  it('should respond 201 if create glossary successfully', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const newGlossary = {
        word: 'foo',
        category: 'Demand type'
      };
      const req = requestAsMember(request(app).post(API_PATH));

      req.send(newGlossary);
      req.expect(201)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.shallowDeepEqual(newGlossary);
          done();
        }));
    }));
  });
});
