const q = require('q');
const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

describe('The contract lib', function() {
  let moduleHelpers;
  let TicketingUserContractModelMock, contracts, contract, queryMock, ALL_CONTRACTS, esnConfig;
  let user, ticketingUser, TicketingUserRoleMock, pubsub, topic, ContractModelMock, ObjectId, contractId;

  beforeEach(function() {
    moduleHelpers = this.moduleHelpers;
    ObjectId = mongoose.Types.ObjectId;
    contractId = new ObjectId();
    ALL_CONTRACTS = require(moduleHelpers.backendPath + '/lib/constants').ALL_CONTRACTS;
    user = {
      _id: '5e204f99cdc2b21444f07bdd'
    };

    ticketingUser = {
      user: '5e204f99cdc2b21444f07bdd',
      _id: '5e204fa9cdc2b21444f07be4',
      role: 'expert'
    };

    contracts = [
      { _id: 1 },
      { _id: 2 },
      { _id: 3 },
      { _id: 4 }
    ];

    contract = {
      _id: '5e204fa9cdc2b21444f07be4',
      name: 'contract 1'
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

    moduleHelpers.addDep('pubsub', pubsub);
    moduleHelpers.addDep('esn-config', esnConfig);

    queryMock = function(objectToReturn) {
      return {
        exec: sinon.stub().returns(q.when(objectToReturn)),
        populate: sinon.spy(
          function() {
            return this;
          })
      };
    };

    TicketingUserContractModelMock = {
      find: sinon.stub().returns(queryMock(contracts)),
      remove: sinon.spy(
        function() {
          return {
            exec: sinon.stub().returns(q.when())
          };
        }
      )
    };

    TicketingUserRoleMock = {
      findOne: sinon.stub().returns(queryMock(user))
    };

    ContractModelMock = {
      findByIdAndRemove: sinon.stub().returns(q.when(contract))
    };

    moduleHelpers.mockModels({
      TicketingUserRole: TicketingUserRoleMock,
      TicketingUserContract: TicketingUserContractModelMock,
      Contract: ContractModelMock
    });

    pubsub.local.topic.withArgs('ticketing:contract:deleted').returns(topic);
  });

  const getModule = () => require(moduleHelpers.backendPath + '/lib/contract')(moduleHelpers.dependencies);

  describe('the allowedContracts method', function() {
    it('should return the ALL_CONTRACTS for administrators and experts', function(done) {
      getModule()
        .allowedContracts({ user, ticketingUser })
        .then(contracts => {
          expect(contracts).to.equal(ALL_CONTRACTS);
          done();
        })
        .catch(done);
    });

    it('should return the contracts list for customers', function(done) {
      ticketingUser.role = 'benificiary';

      getModule()
        .allowedContracts({ user, ticketingUser })
        .then(contracts => {
          expect(contracts).to.equal(contracts);
          done();
        })
        .catch(done);
    });
  });

  describe('the removeById function', function() {
    it('should remove user roles related to contract', function(done) {
      getModule()
        .removeById(contractId)
        .then(deletedContract => {
          expect(deletedContract).to.equals(contract);
          expect(ContractModelMock.findByIdAndRemove).to.have.been.calledWith(contractId);
          done();
        })
        .catch(done);
    });
  });
});
