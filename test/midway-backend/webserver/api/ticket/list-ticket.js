'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;
const MODULE_NAME = 'linagora.esn.ticketing';

describe('GET /api/tickets', function() {
  const API_PATH = '/api/tickets';
  let app, lib, helpers, ObjectId;
  let user1, user2, software, contract, ticket;
  const password = 'secret';
  const longDescription = 'fooooooooooooooooooooooooooooooooooooooooooooooooo';

  beforeEach(function(done) {
    const self = this;

    helpers = self.helpers;
    ObjectId = this.testEnv.core.db.mongo.mongoose.Types.ObjectId;

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
          lib.software.create({
            name: 'software1',
            category: 'category1',
            versions: ['1', '2', '3']
          })
          .then(createdSofware => {
            software = createdSofware;
          })
        )
        .then(() =>
          lib.contract.create({
            title: 'contract',
            organization: new ObjectId(),
            defaultSupportManager: new ObjectId(),
            startDate: new Date(),
            endDate: new Date(),
            demands: [{
              demandType: 'Info',
              softwareType: 'Normal',
              issueType: 'Blocking'
            }],
            software: [{
              template: software._id,
              type: 'Normal',
              versions: ['1', '2']
            }]
          })
          .then(createdContract => (contract = createdContract))
        )
        .then(() =>
          lib.ticket.create({
            state: 'New',
            contract: contract._id,
            title: 'ticket 1',
            demandType: 'Info',
            severity: 'Blocking',
            software: {
              template: contract.software[0].template,
              criticality: contract.software[0].type,
              version: '1'
            },
            description: longDescription,
            requester: user1._id,
            supportManager: user1._id
          })
          .then(createdTicket => {
            ticket = createdTicket;
            done();
          })
        )
        .catch(err => done(err));
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

  it('should respond 200 with list all tickets if state is not given', function(done) {
    const ticketAJSON = {
      state: 'Closed',
      contract: contract._id,
      title: 'ticket A',
      demandType: 'Info',
      severity: 'Blocking',
      software: {
        template: contract.software[0].template,
        criticality: contract.software[0].type,
        version: '1'
      },
      description: longDescription,
      requester: user1._id,
      supportManager: user1._id
    };
    const ticketBJSON = {
      state: 'Abandoned',
      contract: contract._id,
      title: 'ticket B',
      demandType: 'Info',
      severity: 'Blocking',
      software: {
        template: contract.software[0].template,
        criticality: contract.software[0].type,
        version: '1'
      },
      description: longDescription,
      requester: user1._id,
      supportManager: user1._id
    };

    lib.ticket.create(ticketAJSON)
      .then(() => lib.ticket.create(ticketBJSON))
      .then(() =>
        helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
          const req = requestAsMember(request(app).get(API_PATH));

          req.expect(200)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.headers['x-esn-items-count']).to.equal('3');
            expect(res.body[0].title).to.equal(ticketBJSON.title);
            expect(res.body[0].contract._id).to.equal(`${ticketBJSON.contract}`);
            expect(res.body[0].software.template._id).to.equal(`${ticketBJSON.software.template}`);
            expect(res.body[1].title).to.equal(ticketAJSON.title);
            expect(res.body[1].contract._id).to.equal(`${ticketAJSON.contract}`);
            expect(res.body[1].software.template._id).to.equal(`${ticketAJSON.software.template}`);
            expect(res.body[2].title).to.equal(ticket.title);
            expect(res.body[2].contract._id).to.equal(`${ticket.contract}`);
            expect(res.body[2].software.template._id).to.equal(`${ticket.software.template}`);

            done();
          }));
        }))
      )
      .catch(err => done(err));
  });

  it('should respond 200 with list all open tickets if state = "open"', function(done) {
    const ticketAJSON = {
      state: 'Closed',
      contract: contract._id,
      title: 'ticket A',
      demandType: 'Info',
      severity: 'Blocking',
      software: {
        template: contract.software[0].template,
        criticality: contract.software[0].type,
        version: '1'
      },
      description: longDescription,
      requester: user1._id,
      supportManager: user1._id
    };
    const ticketBJSON = {
      state: 'Abandoned',
      contract: contract._id,
      title: 'ticket B',
      demandType: 'Info',
      severity: 'Blocking',
      software: {
        template: contract.software[0].template,
        criticality: contract.software[0].type,
        version: '1'
      },
      description: longDescription,
      requester: user1._id,
      supportManager: user1._id
    };

    lib.ticket.create(ticketAJSON)
      .then(() => lib.ticket.create(ticketBJSON))
      .then(() =>
        helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
          const req = requestAsMember(request(app).get(API_PATH));

          req.query({ state: 'open' });
          req.expect(200)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.headers['x-esn-items-count']).to.equal('1');
            expect(res.body[0].title).to.equal(ticket.title);
            expect(res.body[0].contract._id).to.equal(`${ticket.contract}`);
            expect(res.body[0].software.template._id).to.equal(`${ticket.software.template}`);

            done();
          }));
        }))
      )
      .catch(err => done(err));
  });

  it('should respond 200 with list tickets which have state equal given state', function(done) {
    const ticketAJSON = {
      state: 'Closed',
      contract: contract._id,
      title: 'ticket A',
      demandType: 'Info',
      severity: 'Blocking',
      software: {
        template: contract.software[0].template,
        criticality: contract.software[0].type,
        version: '1'
      },
      description: longDescription,
      requester: user1._id,
      supportManager: user1._id
    };
    const ticketBJSON = {
      state: 'Abandoned',
      contract: contract._id,
      title: 'ticket B',
      demandType: 'Info',
      severity: 'Blocking',
      software: {
        template: contract.software[0].template,
        criticality: contract.software[0].type,
        version: '1'
      },
      description: longDescription,
      requester: user1._id,
      supportManager: user1._id
    };

    lib.ticket.create(ticketAJSON)
      .then(() => lib.ticket.create(ticketBJSON))
      .then(() =>
        helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
          const req = requestAsMember(request(app).get(API_PATH));

          req.query({ state: 'Closed' });
          req.expect(200)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.headers['x-esn-items-count']).to.equal('1');
            expect(res.body[0].title).to.equal(ticketAJSON.title);
            expect(res.body[0].contract._id).to.equal(`${ticketAJSON.contract}`);
            expect(res.body[0].software.template._id).to.equal(`${ticketAJSON.software.template}`);

            done();
          }));
        }))
      )
      .catch(err => done(err));
  });

  it('should respond 200 with the list contains only latest ticket based on updated time if offset=0 and limit=1', function(done) {
    lib.ticket.create({
      contract: contract._id,
      title: 'ticket 2',
      demandType: 'Info',
      severity: 'Blocking',
      software: {
        template: contract.software[0].template,
        criticality: contract.software[0].type,
        version: '1'
      },
      description: longDescription,
      requester: user1._id,
      supportManager: user1._id
    })
    .then(createdTicket => {
      helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).get(API_PATH));

        req.query({ offset: 0, limit: 1 });
        req.expect(200)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.headers['x-esn-items-count']).to.equal('1');
            expect(res.body[0].title).to.equal(createdTicket.title);
            expect(res.body[0].contract._id).to.equal(`${createdTicket.contract}`);
            expect(res.body[0].software.template._id).to.equal(`${createdTicket.software.template}`);

            done();
          }));
      }));
    }, err => done(err || 'should resolve'));
  });

  it('should respond 200 with the list contains only oldest ticket based on updated time if offset=1', function(done) {
    lib.ticket.create({
      contract: contract._id,
      title: 'ticket 2',
      demandType: 'Info',
      severity: 'Blocking',
      software: {
        template: contract.software[0].template,
        criticality: contract.software[0].type,
        version: '1'
      },
      description: longDescription,
      requester: user1._id,
      supportManager: user1._id
    })
    .then(() => {
      helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).get(API_PATH));

        req.query({ offset: 1 });
        req.expect(200)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.headers['x-esn-items-count']).to.equal('1');
          expect(res.body[0].title).to.equal(ticket.title);
          expect(res.body[0].contract._id).to.equal(`${ticket.contract}`);
          expect(res.body[0].software.template._id).to.equal(`${ticket.software.template}`);

          done();
        }));
      }));
    }, err => done(err || 'should resolve'));
  });
});
