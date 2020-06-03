const q = require('q');
const expect = require('chai').expect;
const sinon = require('sinon');
const mockery = require('mockery');
const mongoose = require('mongoose');

describe('The ticket lib', function() {
  let ObjectId, moduleHelpers;
  let TicketModelMock, ContractModelMock, ticket, tickets, contract, ticketId, queryMock, EMAIL_NOTIFICATIONS, NOTIFICATIONS_TYPE;
  let emailModule, sendMock;
  let topic, pubsub, cnsModuleMock, esnConfig;
  let user, ticketingUser, TicketingUserRoleMock;
  let options, filterModule;

  beforeEach(function() {
    moduleHelpers = this.moduleHelpers;
    EMAIL_NOTIFICATIONS = require(moduleHelpers.backendPath + '/lib/constants').EMAIL_NOTIFICATIONS;
    NOTIFICATIONS_TYPE = require(moduleHelpers.backendPath + '/lib/constants').NOTIFICATIONS_TYPE;
    filterModule = require(moduleHelpers.backendPath + '/lib/filter');
    ObjectId = mongoose.Types.ObjectId;
    ticketId = new ObjectId();
    ticket = {
      title: 'Some title',
      contract: '5dcc05a92b59413424a29358',
      type: 'Information',
      description: '<p>Some description</p>',
      callNumber: '0707070707',
      meetingId: '01234',
      events: [],
      beneficiary: {
        name: 'michael cales'
      },
      responsible: {
        name: 'Amy WOLSH'
      },
      software: {
        version: '1.2',
        os: 'linux',
        technicalReferent: 'Michaek CALES',
        software: {
          _id: ObjectId('5dcc056a2b59413424a29354'),
          name: 'Qgis'
        },
        critical: 'standard'
      },
      severity: 'Minor'
    };

    contract = {
      timezone: 'Europe/Paris',
      businessHours: {
        start: 9,
        end: 18
      },
      features: {
        nonBusinessHours: false
      },
      Engagements: {
        critical: {
          engagements: [
            {
              supported: {
                businessHours: 'PT1H',
                nonBusinessHours: 'PT2H'
              },
              bypassed: {
                businessHours: 'P1D',
                nonBusinessHours: 'P2D'
              },
              resolved: {
                businessHours: 'P2D',
                nonBusinessHours: 'P4D'
              }
            }
          ]
        },
        sensible: {
          engagements: [
            {
              supported: {
                businessHours: 'PT1H',
                nonBusinessHours: 'PT2H'
              },
              bypassed: {
                businessHours: 'P1D',
                nonBusinessHours: 'P2D'
              },
              resolved: {
                businessHours: 'P2D',
                nonBusinessHours: 'P4D'
              }
            }
          ]
        },
        standard: {
          engagements: [
            {
              supported: {
                businessHours: 'PT1H',
                nonBusinessHours: 'PT2H'
              },
              bypassed: {
                businessHours: 'P1D',
                nonBusinessHours: 'P2D'
              },
              resolved: {
                businessHours: 'P2D',
                nonBusinessHours: 'P4D'
              }
            }
          ]
        }
      }
    };

    user = {
      _id: '5e204f99cdc2b21444f07bdd'
    };

    ticketingUser = {
      user: '5e204f99cdc2b21444f07bdd',
      _id: '5e204fa9cdc2b21444f07be4',
      role: 'expert'
    };

    tickets = [
      {
        _id: 1,
        cns: {},
        events: []
      },
      {
        _id: 2,
        cns: {},
        events: []
      },
      {
        _id: 3,
        cns: {},
        events: []
      },
      {
        _id: 4,
        cns: {},
        events: []
      }
    ];

    options = {
      filter: 'closed'
    };

    pubsub = {
      local: {
        topic: sinon.stub()
      }
    };

    topic = { publish: sinon.spy() };

    esnConfig = function() {
      return {
        inModule: function() {
          return {
            get: sinon.stub().returns(Promise.resolve({}))
          };
        }
      };
    };

    cnsModuleMock = () => ({
      computeCns: () => ({})
    });

    mockery.registerMock('../cns', cnsModuleMock);

    moduleHelpers.addDep('pubsub', pubsub);
    moduleHelpers.addDep('esn-config', esnConfig);

    queryMock = function(objectToReturn) {
      return {
        exec: sinon.stub().returns(q.when(objectToReturn)),
        populate: sinon.spy(
          function() {
            return this;
          }),
        lean: sinon.spy(
          function() {
            return this;
          }),
        count: sinon.spy(
          function() {
            return {
              exec: sinon.stub().returns(q.when(Array.isArray(objectToReturn) ? objectToReturn.length : 1))
            };
          }
        ),
        skip: sinon.spy(
          function() {
            return this;
          }),
        limit: sinon.spy(
          function() {
            return this;
          }),
        sort: sinon.spy(
          function() {
              return this;
            })
      };
    };

    TicketModelMock = {
      findById: sinon.stub().returns(queryMock(ticket)),
      find: sinon.stub().returns(queryMock(tickets))
    };

    ContractModelMock = {
      findById: sinon.stub().returns(queryMock(contract))
    };

    TicketingUserRoleMock = {
      findOne: sinon.stub().returns(queryMock(user))
    };

    moduleHelpers.mockModels({
      Contract: ContractModelMock,
      Ticket: TicketModelMock,
      TicketingUserRole: TicketingUserRoleMock
    });

    sendMock = sinon.stub().returns(Promise.resolve({}));
    emailModule = {
      send: sendMock
    };
    mockery.registerMock('../email', () => emailModule);

  });

  const getModule = () => require(moduleHelpers.backendPath + '/lib/ticket')(moduleHelpers.dependencies);

  describe('the count function', function() {
    it('should count the tickets', function(done) {
      getModule()
        .count({ user, ticketingUser })
        .then(size => {
          expect(size).to.equals(tickets.length);
          done();
        });
    });
  });

  describe('the list function', function() {
    it('should use the filter param', function(done) {
      const filterGetByIdSpy = sinon.spy(filterModule, 'getById');

      getModule()
        .list({ user, ticketingUser }, options)
        .then(ticketsList => {
          expect(ticketsList).to.have.lengthOf(tickets.length);
          expect(filterGetByIdSpy).to.have.been.calledOnce;
          expect(filterGetByIdSpy).to.have.been.calledWith('closed');
          done();
        })
        .catch(done);
    });

    it('should correctly set the filter query', function(done) {
      TicketModelMock = {
        find: sinon.spy(
          function() {
            return queryMock(tickets);
          })
      };

      moduleHelpers.mockModels({
        Contract: ContractModelMock,
        Ticket: TicketModelMock,
        TicketingUserRole: TicketingUserRoleMock
      });

      getModule()
        .list({ user, ticketingUser }, options)
        .then(() => {
          expect(TicketModelMock.find).to.have.been.calledOnce;
          expect(TicketModelMock.find).to.have.been.calledWith({ status: 'closed' });
          done();
        })
        .catch(done);
    });
  });

  describe('The getById function', function() {
    it('should find the ticket from his id', function(done) {

      getModule()
        .getById(ticketId)
        .then(foundTicket => {
          expect(TicketModelMock.findById).to.have.been.calledWith(ticketId);
          expect(foundTicket).to.equals(ticket);
          done();
        });
    });
  });

  describe('The removeById function', function() {

    beforeEach(function() {
      TicketModelMock.findByIdAndRemove = sinon.stub().returns(q.when(ticket));
      pubsub.local.topic.withArgs('ticketing:team:deleted').returns(topic);
    });

    it('should call Ticket.findByIdAndRemove, return the deleted ticket and call topic.publish', function(done) {

    getModule()
      .removeById(ticketId)
      .then(deletedTicket => {
        expect(deletedTicket).to.equals(ticket);
        expect(TicketModelMock.findByIdAndRemove).to.have.been.calledWith(ticketId);
        expect(topic.publish).to.have.been.calledWith(deletedTicket);
        done();
      })
      .catch(done);
    });
  });

  describe('The updateById function', function() {
    let ticketingUser, eventAuthor, modifiedMock, modifiedTicketMock, updateQuery;

    this.beforeEach(function() {

      ticket.toObject = sinon.stub().returns(ticket);

      ticketingUser = {
        _id: '5d9dfd392054e5013cc90e69',
        user: '5d9dfd392054e5013cc90e67',
        role: 'customer',
        email: 'alice.monier@open-paas.org',
        name: 'Alice MONIER',
        type: 'beneficiary'
      };

      eventAuthor = {
        type: ticketingUser.type,
        name: ticketingUser.name,
        id: ticketingUser.user
      };
    });

    it(`Should: 
        - Change the title, description, the call number and the meeting ID
        - Add the changes in events
        - Send an Email to notify about update`, function(done) {
      modifiedMock = {
        ...ticket,
        title: 'Change title',
        description: '<p>Change description</p>',
        callNumber: '0808080808',
        meetingId: '45678'
      };

      modifiedTicketMock = {
        ...modifiedMock,
        events: [
          {
            changes: [
              {
                field: 'title',
                action: 'changed',
                oldValue: 'Some title',
                newValue: 'Change title'
              },
              {
                field: 'callNumber',
                action: 'changed',
                oldValue: '0707070707',
                newValue: '0808080808'
              },
              {
                field: 'meetingId',
                action: 'changed',
                oldValue: '01234',
                newValue: '45678'
              },
              {
                field: 'description',
                action: 'changed',
                oldValue: '<p>Some description</p>',
                newValue: '<p>Change description</p>'
              }
            ],
            author: eventAuthor
          }
        ]
     };

      updateQuery = {
        exec: sinon.stub().returns(q.when('updatedTicket'))
      };

      TicketModelMock.findByIdAndUpdate = sinon.stub().returns(updateQuery);

      getModule()
      .updateById(ticketId, modifiedMock, ticketingUser)
      .then(updatedTicket => {
        expect(TicketModelMock.findByIdAndUpdate).to.have.been.calledOnce;
        expect(TicketModelMock.findByIdAndUpdate).to.have.been.calledWith(ticketId, { $set: modifiedTicketMock }, { new: true });
        expect(emailModule.send).to.have.been.calledWith(EMAIL_NOTIFICATIONS.TYPES.UPDATED, NOTIFICATIONS_TYPE.ALL_ATTENDEES, updatedTicket);
        done();
      })
      .catch(done);
    });

    it(`Should: 
        - Change the type, the software and the severity
        - Add the changes in events
        - Send an Email to notify about update`, function(done) {
      modifiedMock = {
        ...ticket,
        type: 'Anomaly',
        software: {
          version: '2.3',
          os: 'win',
          technicalReferent: 'Michaek CALES',
          software: {
            _id: ObjectId('5dcc056a2b59413424a22698'),
            name: 'ArcGis'
          },
          critical: 'standard'
        },
        severity: 'Major'
      };

      modifiedTicketMock = {
        ...modifiedMock,
        events: [
          {
            changes: [
              {
                field: 'type',
                action: 'changed',
                oldValue: 'Information',
                newValue: 'Anomaly'
              },
              {
                field: 'severity',
                action: 'changed',
                oldValue: 'Minor',
                newValue: 'Major'
              },
              {
                field: 'software',
                action: 'changed',
                oldValue: 'Qgis 1.2 linux',
                newValue: 'ArcGis 2.3 win'
              }
            ],
            author: eventAuthor
          }
        ]
      };

      updateQuery = {
        exec: sinon.stub().returns(q.when('updatedTicket'))
      };

      TicketModelMock.findByIdAndUpdate = sinon.stub().returns(updateQuery);

      getModule()
      .updateById(ticketId, modifiedMock, ticketingUser)
      .then(updatedTicket => {
        expect(TicketModelMock.findByIdAndUpdate).to.have.been.calledOnce;
        expect(TicketModelMock.findByIdAndUpdate).to.have.been.calledWith(ticketId, { $set: modifiedTicketMock }, { new: true });
        expect(emailModule.send).to.have.been.calledWith(EMAIL_NOTIFICATIONS.TYPES.UPDATED, NOTIFICATIONS_TYPE.ALL_ATTENDEES, updatedTicket);
        done();
      })
      .catch(done);
    });

    it(`Should: 
        - Change the beneficiary and the responsible
        - Add the changes in events
        - Send an Email to notify about update`, function(done) {
      modifiedMock = {
        ...ticket,
        beneficiary: {
          name: 'Michel Dupont'
        },
        responsible: {
          name: 'Rachid Oubraim'
        }
      };

      modifiedTicketMock = {
        ...modifiedMock,
        events: [
          {
            changes: [
              {
                field: 'beneficiary',
                action: 'changed',
                oldValue: 'michael cales',
                newValue: 'Michel Dupont'
              },
              {
                field: 'responsible',
                action: 'changed',
                oldValue: 'Amy WOLSH',
                newValue: 'Rachid Oubraim'
              }
            ],
            author: eventAuthor
          }
        ]
      };

      updateQuery = {
        exec: sinon.stub().returns(q.when('updatedTicket'))
      };

      TicketModelMock.findByIdAndUpdate = sinon.stub().returns(updateQuery);

      getModule()
      .updateById(ticketId, modifiedMock, ticketingUser)
      .then(updatedTicket => {
        expect(TicketModelMock.findByIdAndUpdate).to.have.been.calledOnce;
        expect(TicketModelMock.findByIdAndUpdate).to.have.been.calledWith(ticketId, { $set: modifiedTicketMock }, { new: true });
        expect(emailModule.send).to.have.been.calledWith(EMAIL_NOTIFICATIONS.TYPES.UPDATED, NOTIFICATIONS_TYPE.ALL_ATTENDEES, updatedTicket);
        done();
      })
      .catch(done);
    });

    it(`Should: 
        - Add a responsible
        - Add the changes in events
        - Send an Email to notify about update`, function(done) {
      delete ticket.responsible;

      modifiedMock = {
        ...ticket,
        responsible: {
          name: 'Rachid Oubraim'
        }
      };

      modifiedTicketMock = {
        ...modifiedMock,
        events: [
          {
            changes: [
              {
                field: 'responsible',
                action: 'added',
                oldValue: '',
                newValue: 'Rachid Oubraim'
              }
            ],
            author: eventAuthor
          }
        ]
      };

      updateQuery = {
        exec: sinon.stub().returns(q.when('updatedTicket'))
      };

      TicketModelMock.findByIdAndUpdate = sinon.stub().returns(updateQuery);

      getModule()
      .updateById(ticketId, modifiedMock, ticketingUser)
      .then(updatedTicket => {
        expect(TicketModelMock.findByIdAndUpdate).to.have.been.calledOnce;
        expect(TicketModelMock.findByIdAndUpdate).to.have.been.calledWith(ticketId, { $set: modifiedTicketMock }, { new: true });
        expect(emailModule.send).to.have.been.calledWith(EMAIL_NOTIFICATIONS.TYPES.UPDATED, NOTIFICATIONS_TYPE.ALL_ATTENDEES, updatedTicket);
        done();
      })
      .catch(done);
    });

    it(`Should: 
        - Add a software and a severity
        - Add the changes in events
        - Send an Email to notify about update`, function(done) {
      delete ticket.software;
      delete ticket.severity;

      modifiedMock = {
        ...ticket,
        software: {
          version: '2.3',
          os: 'win',
          technicalReferent: 'Michaek CALES',
          software: {
            _id: ObjectId('5dcc056a2b59413424a22698'),
            name: 'ArcGis'
          },
          critical: 'standard'
        },
        severity: 'Major'
      };

      modifiedTicketMock = {
        ...modifiedMock,
        events: [
          {
            changes: [
              {
                field: 'severity',
                action: 'added',
                oldValue: '',
                newValue: 'Major'
              },
              {
                field: 'software',
                action: 'added',
                oldValue: '',
                newValue: 'ArcGis 2.3 win'
              }
            ],
            author: eventAuthor
          }
        ]
      };

      updateQuery = {
        exec: sinon.stub().returns(q.when('updatedTicket'))
      };

      TicketModelMock.findByIdAndUpdate = sinon.stub().returns(updateQuery);

      getModule()
      .updateById(ticketId, modifiedMock, ticketingUser)
      .then(updatedTicket => {
        expect(TicketModelMock.findByIdAndUpdate).to.have.been.calledOnce;
        expect(TicketModelMock.findByIdAndUpdate).to.have.been.calledWith(ticketId, { $set: modifiedTicketMock }, { new: true });
        expect(emailModule.send).to.have.been.calledWith(EMAIL_NOTIFICATIONS.TYPES.UPDATED, NOTIFICATIONS_TYPE.ALL_ATTENDEES, updatedTicket);
        done();
      })
      .catch(done);
    });

    it(`Should: 
        - Remove the software the a severity
        - Add the changes in events
        - Send an Email to notify about update`, function(done) {
      modifiedMock = {
        title: 'Some title',
        contract: '5dcc05a92b59413424a29358',
        type: 'Information',
        description: '<p>Some description</p>',
        callNumber: '0707070707',
        meetingId: '01234',
        relatedRequests: [],
        participants: [],
        events: [],
        beneficiary: {
          name: 'michael cales'
        },
        responsible: {
          name: 'Amy WOLSH'
        }
      };

      modifiedTicketMock = {
        ...modifiedMock,
        events: [
          {
            changes: [
              {
                field: 'software',
                action: 'removed',
                oldValue: 'Qgis 1.2 linux',
                newValue: ''
              },
              {
                field: 'severity',
                action: 'removed',
                oldValue: 'Minor',
                newValue: ''
              }
            ],
            author: eventAuthor
          }
        ]
      };

      updateQuery = {
        exec: sinon.stub().returns(q.when('updatedTicket'))
      };

      TicketModelMock.findByIdAndUpdate = sinon.stub().returns(updateQuery);

      getModule()
      .updateById(ticketId, modifiedMock, ticketingUser)
      .then(updatedTicket => {
        expect(TicketModelMock.findByIdAndUpdate).to.have.been.calledOnce;
        expect(TicketModelMock.findByIdAndUpdate).to.have.been.calledWith(ticketId, { $set: modifiedTicketMock, $unset: { severity: 1, software: 1 } }, { new: true });
        expect(emailModule.send).to.have.been.calledWith(EMAIL_NOTIFICATIONS.TYPES.UPDATED, NOTIFICATIONS_TYPE.ALL_ATTENDEES, updatedTicket);
        done();
      })
      .catch(done);
    });
  });

  describe('The addEvent function', function() {
    let event, updateQuery;

    beforeEach(function() {
      event = {
        isPrivate: false,
        isSurvey: false,
        _id: ObjectId('5e81c6dd677e5f0242a108ec'),
        timestamps: {
            createdAt: '2020-03-30T10:15:57.900Z'
        },
        author: {
            id: '5d9f4be785cc221c1de9ae2f',
            name: 'michael cales',
            type: 'expert'
        },
        comment: '<p>It still don\'t work for me</p>',
        status: '',
        attachments: [],
        changes: []
    };

      updateQuery = {
        exec: sinon.stub().returns(q.when('updatedTicket'))
      };

      TicketModelMock.findByIdAndUpdate = sinon.stub().returns(updateQuery);
    });

    //TODO: Add unit tests for the addEvent function in different cases

    it('should call emailModule.send with the notification type ALL_ATTENDEES after updating the ticket ', function(done) {
      getModule()
      .addEvent(ticketId, event)
      .then(updatedTicket => {
        expect(TicketModelMock.findByIdAndUpdate).to.have.been.calledOnce;
        expect(emailModule.send).to.have.been.calledWith(EMAIL_NOTIFICATIONS.TYPES.UPDATED, NOTIFICATIONS_TYPE.ALL_ATTENDEES, updatedTicket);
        done();
      })
      .catch(done);
    });

    it('should call emailModule.send with the notification type EXPERT_ATTENDEES after updating the ticket ', function(done) {
      event = {
        ...event,
        isPrivate: true
      };

      getModule()
      .addEvent(ticketId, event)
      .then(updatedTicket => {
        expect(TicketModelMock.findByIdAndUpdate).to.have.been.calledOnce;
        expect(emailModule.send).to.have.been.calledWith(EMAIL_NOTIFICATIONS.TYPES.UPDATED, NOTIFICATIONS_TYPE.EXPERT_ATTENDEES, updatedTicket);
        done();
      })
      .catch(done);
    });
  });
});
