'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;
const _ = require('lodash');

describe('GET /ticketing/api/tickets', function() {
  const API_PATH = '/ticketing/api/tickets';
  let app, lib, helpers;
  let user1, user2, software, contract, organization;
  const password = 'secret';
  const description = 'fooooooooooooooooooooooooooooooooooooooooooooooooo';

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
    .then(() => done())
    .catch(err => done(err));
  });

  const getObjectFromModel = document => JSON.parse(JSON.stringify(document)); // Because model object use original type like Bson, Date
  const populateTicket = (ticket, options) => Object.assign(_.cloneDeep(ticket), {
    contract: {
      _id: options.contract._id,
      title: options.contract.title,
      demands: options.contract.demands,
      organization: {
        _id: options.organization._id,
        shortName: options.organization.shortName
      }
    },
    software: {
      template: {
        _id: options.software._id,
        name: options.software.name
      }
    },
    supportManager: {
      _id: options.user._id,
      firstname: options.user.firstname,
      lastname: options.user.lastname
    }
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(err => done(err));
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
      description,
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
      description,
      requester: user1._id,
      supportManager: user1._id
    };
    const expectTicketA = populateTicket(ticketAJSON, {
      contract,
      organization,
      software,
      user: user1
    });
    const expectTicketB = populateTicket(ticketBJSON, {
      contract,
      organization,
      software,
      user: user1
    });

    lib.ticket.create(ticketAJSON)
      .then(() => lib.ticket.create(ticketBJSON))
      .then(() =>
        helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
          const req = requestAsMember(request(app).get(API_PATH));

          req.expect(200)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.headers['x-esn-items-count']).to.equal('2');
            expect(res.body[0]).to.shallowDeepEqual(getObjectFromModel(expectTicketB));
            expect(res.body[1]).to.shallowDeepEqual(getObjectFromModel(expectTicketA));
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
      description,
      requester: user1._id,
      supportManager: user1._id
    };
    const ticketBJSON = {
      state: 'Awaiting',
      contract: contract._id,
      title: 'ticket B',
      demandType: 'Info',
      severity: 'Blocking',
      software: {
        template: contract.software[0].template,
        criticality: contract.software[0].type,
        version: '1'
      },
      description,
      requester: user1._id,
      supportManager: user1._id
    };
    const expectResult = populateTicket(ticketBJSON, {
      contract,
      organization,
      software,
      user: user1
    });

    lib.ticket.create(ticketAJSON)
      .then(() => lib.ticket.create(ticketBJSON))
      .then(() =>
        helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
          const req = requestAsMember(request(app).get(API_PATH));

          req.query({ state: 'open' });
          req.expect(200)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.headers['x-esn-items-count']).to.equal('1');
            expect(res.body[0]).to.shallowDeepEqual(getObjectFromModel(expectResult));
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
      description,
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
      description,
      requester: user1._id,
      supportManager: user1._id
    };
    const expectResult = populateTicket(ticketAJSON, {
      contract,
      organization,
      software,
      user: user1
    });

    lib.ticket.create(ticketAJSON)
      .then(() => lib.ticket.create(ticketBJSON))
      .then(() =>
        helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
          const req = requestAsMember(request(app).get(API_PATH));

          req.query({ state: 'Closed' });
          req.expect(200)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.headers['x-esn-items-count']).to.equal('1');
            expect(res.body[0]).to.shallowDeepEqual(getObjectFromModel(expectResult));

            done();
          }));
        }))
      )
      .catch(err => done(err));
  });

  it('should respond 200 with the list contains only latest ticket based on updated time if offset=0 and limit=1', function(done) {
    const ticketAJSON = {
      contract: contract._id,
      title: 'ticket 1',
      demandType: 'Info',
      severity: 'Blocking',
      software: {
        template: contract.software[0].template,
        criticality: contract.software[0].type,
        version: '1'
      },
      description,
      requester: user1._id,
      supportManager: user1._id
    };
    const ticketBJSON = {
      contract: contract._id,
      title: 'ticket 2',
      demandType: 'Info',
      severity: 'Blocking',
      software: {
        template: contract.software[0].template,
        criticality: contract.software[0].type,
        version: '1'
      },
      description,
      requester: user1._id,
      supportManager: user1._id
    };
    const expectResult = populateTicket(ticketBJSON, {
      contract,
      organization,
      software,
      user: user1
    });

    lib.ticket.create(ticketAJSON)
      .then(() => lib.ticket.create(ticketBJSON))
      .then(() => {
        helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
          const req = requestAsMember(request(app).get(API_PATH));

          req.query({ offset: 0, limit: 1 });
          req.expect(200)
            .end(helpers.callbacks.noErrorAnd(res => {
              expect(res.headers['x-esn-items-count']).to.equal('1');
              expect(res.body[0]).to.shallowDeepEqual(getObjectFromModel(expectResult));
              done();
            }));
        }));
      }, err => done(err || 'should resolve'));
  });

  it('should respond 200 with the list contains only oldest ticket based on updated time if offset=1', function(done) {
    const ticketAJSON = {
      contract: contract._id,
      title: 'ticket 1',
      demandType: 'Info',
      severity: 'Blocking',
      software: {
        template: contract.software[0].template,
        criticality: contract.software[0].type,
        version: '1'
      },
      description,
      requester: user1._id,
      supportManager: user1._id
    };
    const ticketBJSON = {
      contract: contract._id,
      title: 'ticket 2',
      demandType: 'Info',
      severity: 'Blocking',
      software: {
        template: contract.software[0].template,
        criticality: contract.software[0].type,
        version: '1'
      },
      description,
      requester: user1._id,
      supportManager: user1._id
    };
    const expectResult = populateTicket(ticketAJSON, {
      contract,
      organization,
      software,
      user: user1
    });

    lib.ticket.create(ticketAJSON)
      .then(() => lib.ticket.create(ticketBJSON))
      .then(() => {
        helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
          const req = requestAsMember(request(app).get(API_PATH));

          req.query({ offset: 1 });
          req.expect(200)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.headers['x-esn-items-count']).to.equal('1');
            expect(res.body[0]).to.shallowDeepEqual(getObjectFromModel(expectResult));

            done();
          }));
        }));
      }, err => done(err || 'should resolve'));
  });
});
