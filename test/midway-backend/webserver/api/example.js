'use strict';

const request = require('supertest');
const expect = require('chai').expect;
const MODULE_NAME = 'linagora.esn.ticketing';

describe('The example API', function() {
  let user, app, helpers;
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

      helpers.api.applyDomainDeployment('linagora_IT', function(err, models) {
        if (err) {
          return done(err);
        }
        user = models.users[0];

        done();
      });
    });
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(done);
  });

  describe('GET /example', function() {
    it('should return 401 if not logged in', function(done) {
      helpers.api.requireLogin(app, 'get', '/api/example', done);
    });

    it('should return a message', function(done) {
      helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }
        const req = requestAsMember(request(app).get('/api/example'));

        req.expect(200).end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.deep.equal({ message: 'controller example' });

          done();
        });
      });
    });
  });
});
