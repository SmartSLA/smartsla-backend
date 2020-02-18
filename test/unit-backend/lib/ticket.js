const q = require('q');
const expect = require('chai').expect;
const sinon = require('sinon');
const mockery = require('mockery');
const mongoose = require('mongoose');

describe('The ticket lib', function() {
  let ObjectId, moduleHelpers;
  let TicketModelMock, ContractModelMock, ticket, contract, ticketId, queryMock;
  let emailModule, sendMock;
  let topic, pubsub, cnsModuleMock;

  beforeEach(function() {
    moduleHelpers = this.moduleHelpers;
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

    pubsub = {
      local: {
        topic: sinon.stub()
      }
    };

    topic = { publish: sinon.spy() };

    cnsModuleMock = () => ({
      computeCns: () => ({})
    });

    mockery.registerMock('../cns', cnsModuleMock);

    moduleHelpers.addDep('pubsub', pubsub);

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
        })
      };
    };

    TicketModelMock = {
      findById: sinon.stub().returns(queryMock(ticket))
    };

    ContractModelMock = {
      findById: sinon.stub().returns(queryMock(contract))
    };

    moduleHelpers.mockModels({
      Contract: ContractModelMock,
      Ticket: TicketModelMock
    });

    sendMock = sinon.stub().returns(Promise.resolve({}));
    emailModule = {
      send: sendMock
    };
    mockery.registerMock('../email', () => emailModule);

  });

  const getModule = () => require(moduleHelpers.backendPath + '/lib/ticket')(moduleHelpers.dependencies);

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
    let esnConfig, getConfig, ticketingUser, eventAuthor, modifiedMock, modifiedTicketMock, updateQuery;

    this.beforeEach(function() {
      getConfig = sinon.stub().returns(Promise.resolve('http://localhost:8080'));
      esnConfig = function() {
        return {
          inModule: function() {
            return {
              get: getConfig
            };
          }
        };
      };

      ticket.toObject = sinon.stub().returns(ticket);

      this.moduleHelpers.addDep('esn-config', esnConfig);

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
        expect(emailModule.send).to.have.been.calledWith('UPDATED', updatedTicket, modifiedMock);
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
        expect(emailModule.send).to.have.been.calledWith('UPDATED', updatedTicket, modifiedMock);
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
        expect(emailModule.send).to.have.been.calledWith('UPDATED', updatedTicket, modifiedMock);
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
        expect(emailModule.send).to.have.been.calledWith('UPDATED', updatedTicket, modifiedMock);
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
        expect(emailModule.send).to.have.been.calledWith('UPDATED', updatedTicket, modifiedMock);
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
        expect(emailModule.send).to.have.been.calledWith('UPDATED', updatedTicket, modifiedMock);
        done();
      })
      .catch(done);
    });
  });
});
