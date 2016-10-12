'use strict';

const request = require('supertest');
const expect = require('chai').expect;
const q = require('q');
const _ = require('lodash');

describe('The client API', function() {
  let deps, mongoose, userId, user, app;

  function dependencies(name) {
    return deps[name];
  }

  beforeEach(function(done) {
    mongoose = require('mongoose');
    mongoose.Promise = q.promise;
    mongoose.connect(this.testEnv.mongoUrl);
    userId = mongoose.Types.ObjectId();

    deps = {
      logger: require('../../fixtures/logger'),
      user: {
        moderation: {registerHandler: _.constant()}
      },
      db: {
        mongo: {
          mongoose: mongoose
        }
      },
      authorizationMW: {
        requiresAPILogin: function(req, res, next) {
          req.user = {
            _id: userId
          };

          next();
        }
      }
    };

    app = this.helpers.loadApplication(dependencies);
    const UserSchema = mongoose.model('User');

    user = new UserSchema({
      _id: userId,
      firstname: 'Gutz',
      username: 'gatsu',
      lastname: 'Von Berlichingen'
    });

    user.save(done);
  });

  afterEach(function(done) {
    this.helpers.mongo.dropDatabase(done);
  });

  describe('GET /api/clients', function() {
    it('should return a list of clients', function(done) {
      app.lib.client.list({}).then(function(clients) {
        request(app.express)
          .get('/api/clients')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }

            expect(res.body).to.deep.equal(clients);

            done();
          });
        }, done);
    });
  });

  describe('Get /api/clients/:clientId', function() {
    it('should return the client', function(done) {
      const client = {
        name: 'Linagora',
        address: 'Tunisia',
        access_code: '123',
        access_code_hint: 'hint'
      };

      app.lib.client.create(client).then(function(mongoResult) {
          request(app.express)
            .get('/api/clients/' + mongoResult._id)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) {
                return done(err);
              }

              expect(res.body.client).to.deep.equal(JSON.parse(JSON.stringify(mongoResult)));

              done();
            });
        }, done);
    });
  });

  describe('POST /api/clients', function() {
    it('should create the client', function(done) {
      request(app.express)
        .post('/api/clients')
        .type('json')
        .send({
          name: 'Linagora',
          address: 'Tunisia',
          access_code: '123',
          access_code_hint: 'hint'
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body).to.shallowDeepEqual({
            name: 'Linagora',
            address: 'Tunisia',
            access_code: '123',
            access_code_hint: 'hint'
          });

          done();
        });
    });
  });

  describe('PUT /api/clients/:clientId', function() {
    it('should update the client', function(done) {
      const client = {
        name: 'Linagora',
        address: 'Tunisia',
        access_code: '123',
        access_code_hint: 'hint'
      };

      app.lib.client.create(client).then(function(mongoResult) {
          request(app.express)
            .put('/api/clients/' + mongoResult._id)
            .send({
              address: 'Paris'
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) {
                return done(err);
              }

              expect(res.body).to.shallowDeepEqual({
                name: 'Linagora',
                address: 'Paris',
                access_code: '123',
                access_code_hint: 'hint'
              });

              done();
            });
        }, done);
    });
  });

  describe('DELETE /api/clients/:clientId', function() {
    it('should remove the client', function(done) {
      const client = {
        name: 'Linagora',
        address: 'Tunisia',
        access_code: '123',
        access_code_hint: 'hint'
      };

      app.lib.client.create(client).then(function(mongoResult) {
          request(app.express)
            .delete('/api/clients/' + mongoResult._id)
            .expect(204)
            .end(done);
        }, done);
    });
  });
});
