'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;

describe('POST /ticketing/api/tickets/:id?action="updateState"', function() {
  const API_PATH = '/ticketing/api/tickets';
  let app, lib, helpers;
  let user1, user2, organization, demand1, demand2, software, contract, ticket;
  const password = 'secret';
  const description = 'fooooooooooooooooooooooooooooooooooooooooooooooooo';

  beforeEach(function(done) {
    app = this.app;
    lib = this.lib;
    helpers = this.helpers;

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
      })
    )
    .then(() => done())
    .catch(err => done(err));
  });

  beforeEach(function(done) {
    demand1 = {
      demandType: 'Info1',
      softwareType: 'Normal1',
      issueType: 'Blocking1'
    };
    demand2 = {
      demandType: 'Info2',
      softwareType: 'Normal2',
      issueType: 'Blocking2'
    };

    lib.software.create({
      name: 'software1',
      category: 'category1',
      versions: ['1', '2', '3']
    })
    .then(createdSofware => { software = createdSofware; })
    .then(() =>
      lib.organization.create({
        shortName: 'organization'
      })
      .then(createOrganization => (organization = createOrganization))
    )
    .then(() =>
      lib.contract.create({
        title: 'contract',
        organization: organization._id,
        defaultSupportManager: user1._id,
        startDate: new Date(),
        endDate: new Date(),
        demands: [demand1, demand2],
        software: [{
          template: software._id,
          type: demand1.softwareType,
          versions: ['1', '2']
        }]
      })
      .then(createdContract => (contract = createdContract))
    )
    .then(() =>
      lib.ticket.create({
        contract: contract._id,
        title: 'ticket 1',
        demandType: demand1.demandType,
        severity: demand1.issueType,
        software: {
          template: software._id,
          criticality: demand1.softwareType,
          version: software.versions[0]
        },
        description,
        requester: user1._id,
        supportManager: user1._id,
        supportTechnicians: [user1._id]
      })
      .then(createdTicket => {
        ticket = createdTicket;
        done();
      })
    )
    .catch(err => done(err));
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(err => done(err));
  });

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'post', `${API_PATH}/${ticket._id}`, done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if state is not provied', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {};
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.query({ action: 'updateState' });
      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'state is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if state is invalid', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = { state: 'invalid-state' };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.query({ action: 'updateState' });
      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'state is invalid' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if change state to "New"', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      lib.ticket.create({
        state: 'In progress',
        contract: contract._id,
        title: 'ticket 1',
        demandType: demand1.demandType,
        severity: demand1.issueType,
        software: {
          template: software._id,
          criticality: demand1.softwareType,
          version: software.versions[0]
        },
        description,
        requester: user1._id,
        supportManager: user1._id,
        supportTechnicians: [user1._id]
      })
      .then(createdTicket => {
        const modifiedTicket = { state: 'New' };
        const req = requestAsMember(request(app).post(`${API_PATH}/${createdTicket._id}`));

        req.query({ action: 'updateState' });
        req.send(modifiedTicket);
        req.expect(400)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.body).to.deep.equal({
              error: { code: 400, message: 'Bad Request', details: 'change state of ticket to New is not supported' }
            });
            done();
          }));
      })
      .catch(err => done(err));
    }));
  });

  it('should respond 200 with update ticket', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = { state: 'Awaiting' };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.query({ action: 'updateState' });
      req.send(modifiedTicket);
      req.expect(200)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body.state).to.equal(modifiedTicket.state);
          done();
        }));
    }));
  });

  it('should set response time if it was not set and state changed to "In progress"', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = { state: 'In progress' };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.query({ action: 'updateState' });
      req.send(modifiedTicket);
      req.expect(200)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body.state).to.equal(modifiedTicket.state);
          expect(res.body.times.response).to.exist;
          done();
        }));
    }));
  });

  it('should set suspendedAt if state changed to "Awaiting"', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = { state: 'Awaiting' };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.query({ action: 'updateState' });
      req.send(modifiedTicket);
      req.expect(200)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body.state).to.equal(modifiedTicket.state);
          expect(res.body.times.suspendedAt).to.exist;
          done();
        }));
    }));
  });

  it('should set suspendedAt if state changed to "Awaiting information"', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = { state: 'Awaiting information' };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.query({ action: 'updateState' });
      req.send(modifiedTicket);
      req.expect(200)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body.state).to.equal(modifiedTicket.state);
          expect(res.body.times.suspendedAt).to.exist;
          done();
        }));
    }));
  });

  it('should set suspendedAt if state changed to "Awaiting validation"', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = { state: 'Awaiting validation' };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.query({ action: 'updateState' });
      req.send(modifiedTicket);
      req.expect(200)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body.state).to.equal(modifiedTicket.state);
          expect(res.body.times.suspendedAt).to.exist;
          done();
        }));
    }));
  });

  it('should set suspendedAt if state changed to "Closed"', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = { state: 'Closed' };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.query({ action: 'updateState' });
      req.send(modifiedTicket);
      req.expect(200)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body.state).to.equal(modifiedTicket.state);
          expect(res.body.times.suspendedAt).to.exist;
          done();
        }));
    }));
  });

  it('should set suspend time if state changed from "Awaiting" to "In progress"', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      lib.ticket.create({
        state: 'Awaiting',
        contract: contract._id,
        title: 'ticket 1',
        demandType: demand1.demandType,
        severity: demand1.issueType,
        software: {
          template: software._id,
          criticality: demand1.softwareType,
          version: software.versions[0]
        },
        description,
        requester: user1._id,
        supportManager: user1._id,
        supportTechnicians: [user1._id],
        times: {
          suspendedAt: new Date()
        }
      })
      .then(createdTicket => {
        const modifiedTicket = { state: 'In progress' };
        const req = requestAsMember(request(app).post(`${API_PATH}/${createdTicket._id}`));

        req.query({ action: 'updateState' });
        req.send(modifiedTicket);
        req.expect(200)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.body.state).to.equal(modifiedTicket.state);
            expect(res.body.times.suspend).to.exist;
            done();
          }));
      })
      .catch(err => done(err));
    }));
  });

  it('should set suspend time if state changed from "Awaiting information" to "In progress"', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      lib.ticket.create({
        state: 'Awaiting information',
        contract: contract._id,
        title: 'ticket 1',
        demandType: demand1.demandType,
        severity: demand1.issueType,
        software: {
          template: software._id,
          criticality: demand1.softwareType,
          version: software.versions[0]
        },
        description,
        requester: user1._id,
        supportManager: user1._id,
        supportTechnicians: [user1._id],
        times: {
          suspendedAt: new Date()
        }
      })
      .then(createdTicket => {
        const modifiedTicket = { state: 'In progress' };
        const req = requestAsMember(request(app).post(`${API_PATH}/${createdTicket._id}`));

        req.query({ action: 'updateState' });
        req.send(modifiedTicket);
        req.expect(200)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.body.state).to.equal(modifiedTicket.state);
            expect(res.body.times.suspend).to.exist;
            done();
          }));
      })
      .catch(err => done(err));
    }));
  });

  it('should set suspend time if state changed from "Awaiting validation" to "In progress"', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      lib.ticket.create({
        state: 'Awaiting validation',
        contract: contract._id,
        title: 'ticket 1',
        demandType: demand1.demandType,
        severity: demand1.issueType,
        software: {
          template: software._id,
          criticality: demand1.softwareType,
          version: software.versions[0]
        },
        description,
        requester: user1._id,
        supportManager: user1._id,
        supportTechnicians: [user1._id],
        times: {
          suspendedAt: new Date()
        }
      })
      .then(createdTicket => {
        const modifiedTicket = { state: 'In progress' };
        const req = requestAsMember(request(app).post(`${API_PATH}/${createdTicket._id}`));

        req.query({ action: 'updateState' });
        req.send(modifiedTicket);
        req.expect(200)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.body.state).to.equal(modifiedTicket.state);
            expect(res.body.times.suspend).to.exist;
            done();
          }));
      })
      .catch(err => done(err));
    }));
  });

  it('should set suspend time if state changed from "Closed" to "In progress"', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      lib.ticket.create({
        state: 'Closed',
        contract: contract._id,
        title: 'ticket 1',
        demandType: demand1.demandType,
        severity: demand1.issueType,
        software: {
          template: software._id,
          criticality: demand1.softwareType,
          version: software.versions[0]
        },
        description,
        requester: user1._id,
        supportManager: user1._id,
        supportTechnicians: [user1._id],
        times: {
          suspendedAt: new Date()
        }
      })
      .then(createdTicket => {
        const modifiedTicket = { state: 'In progress' };
        const req = requestAsMember(request(app).post(`${API_PATH}/${createdTicket._id}`));

        req.query({ action: 'updateState' });
        req.send(modifiedTicket);
        req.expect(200)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.body.state).to.equal(modifiedTicket.state);
            expect(res.body.times.suspend).to.exist;
            done();
          }));
      })
      .catch(err => done(err));
    }));
  });
});
