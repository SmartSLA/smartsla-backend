const q = require('q');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('The contract lib', function() {
  let moduleHelpers;
  let TicketingUserContractModelMock, contracts, queryMock, ALL_CONTRACTS, esnConfig;
  let user, ticketingUser, TicketingUserRoleMock, pubsub;

  beforeEach(function() {
    moduleHelpers = this.moduleHelpers;
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

    pubsub = {
      local: {
        topic: sinon.stub()
      }
    };

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
      find: sinon.stub().returns(queryMock(contracts))
    };

    TicketingUserRoleMock = {
      findOne: sinon.stub().returns(queryMock(user))
    };

    moduleHelpers.mockModels({
      TicketingUserRole: TicketingUserRoleMock,
      TicketingUserContract: TicketingUserContractModelMock
    });
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
});
