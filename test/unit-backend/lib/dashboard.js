const q = require('q');
const expect = require('chai').expect;
const sinon = require('sinon');
const mockery = require('mockery');

describe('The dashboard lib', function() {
  let moduleHelpers;
  let mongoose, TicketMock, ContractMock;
  let GROUP;
  let queryWithGroup, queryWithFinalStages, queryWithNoGroup, user, ticketingUser, contract1, contract2;

  beforeEach(function() {
    moduleHelpers = this.moduleHelpers;
    GROUP = require(moduleHelpers.backendPath + '/lib/dashboard/constants').GROUP;

    queryWithGroup = 'ticketByOpenClosed';
    queryWithFinalStages = 'ticketByType';
    queryWithNoGroup = 'topSoftware';

    user = {
      _id: '5e204f99cdc2b21444f07bdd'
    };

    ticketingUser = {
      user: '5e204f99cdc2b21444f07bdd',
      _id: '5e204fa9cdc2b21444f07be4',
      role: 'expert'
    };

    TicketMock = {
      aggregate: sinon.spy()
    };

    contract1 = '5db084ad77e2cc0eb0679e4c';
    contract2 = '5db084ad77e2cc0eb0679e4d';

    ContractMock = {
      allowedContracts: sinon.stub().returns(q.when([contract1, contract2]))
    };

    moduleHelpers.mockModels({
      Ticket: TicketMock
    });

    mongoose = moduleHelpers.dependencies('db').mongo.mongoose;
    mockery.registerMock('../contract', () => ContractMock);
  });

  const getModule = () => require(moduleHelpers.backendPath + '/lib/dashboard')(moduleHelpers.dependencies);

  describe('the processDashboardQuery method', function() {
    it('should fetch the allowed contracts for the user', function(done) {
      getModule()
        .processDashboardQuery({query: { queryId: queryWithGroup }, user, ticketingUser})
        .then(() => {
          expect(ContractMock.allowedContracts).to.have.been.calledWith({ user, ticketingUser });
          done();
        })
        .catch(done);
    });

    it('should call the Ticket aggregation query', function(done) {
      getModule()
        .processDashboardQuery({query: { queryId: queryWithGroup }, user, ticketingUser})
        .then(() => {
          expect(TicketMock.aggregate).to.have.been.called;
          done();
        })
        .catch(done);
    });

    describe('the $group condition', function() {
      it('should not group on date if query has no group option', function(done) {
        TicketMock.aggregate = sinon.spy(pipeline => {
          const groupStage = pipeline.find(stage => !!stage.$group);

          const expectedGroupStageId = '$software.software';

          expect(groupStage.$group._id).to.deep.equal(expectedGroupStageId);
          done();
        });

        getModule()
          .processDashboardQuery({query: { queryId: queryWithNoGroup, group: GROUP.NONE }, user, ticketingUser})
          .catch(done);
      });

      it('should group on whole if none is selected', function(done) {
        TicketMock.aggregate = sinon.spy(pipeline => {
          const groupStage = pipeline.find(stage => !!stage.$group);

          expect(groupStage.$group._id).to.deep.equal(null);
          done();
        });

        getModule()
          .processDashboardQuery({query: { queryId: queryWithGroup, group: GROUP.NONE }, user, ticketingUser})
          .catch(done);
      });

      it('should group on year if year is selected', function(done) {
        TicketMock.aggregate = sinon.spy(pipeline => {
          const groupStage = pipeline.find(stage => !!stage.$group);

          expect(groupStage.$group._id).to.deep.equal({ year: { $year: '$timestamps.createdAt' }});
          done();
        });

        getModule()
          .processDashboardQuery({query: { queryId: queryWithGroup, group: GROUP.YEAR }, user, ticketingUser})
          .catch(done);
      });

      it('should group on year and month if month is selected', function(done) {
        TicketMock.aggregate = sinon.spy(pipeline => {
          const groupStage = pipeline.find(stage => !!stage.$group);

          expect(groupStage.$group._id).to.deep.equal(
            {
              year: { $year: '$timestamps.createdAt' },
              month: { $month: '$timestamps.createdAt' }
            });
          done();
        });

        getModule()
          .processDashboardQuery({query: { queryId: queryWithGroup, group: GROUP.MONTH }, user, ticketingUser})
          .catch(done);
      });

      it('should group on year, month and day if day is selected', function(done) {
        TicketMock.aggregate = sinon.spy(pipeline => {
          const groupStage = pipeline.find(stage => !!stage.$group);

          expect(groupStage.$group._id).to.deep.equal(
            {
              year: { $year: '$timestamps.createdAt' },
              month: { $month: '$timestamps.createdAt' },
              day: { $dayOfMonth: '$timestamps.createdAt' }
            });
          done();
        });

        getModule()
          .processDashboardQuery({query: { queryId: queryWithGroup, group: GROUP.DAY }, user, ticketingUser})
          .catch(done);
      });

      it('should group on year and month as default group', function(done) {
        TicketMock.aggregate = sinon.spy(pipeline => {
          const groupStage = pipeline.find(stage => !!stage.$group);

          expect(groupStage.$group._id).to.deep.equal(
            {
              year: { $year: '$timestamps.createdAt' },
              month: { $month: '$timestamps.createdAt' }
            });
          done();
        });

        getModule()
          .processDashboardQuery({query: { queryId: queryWithGroup }, user, ticketingUser})
          .catch(done);
      });
    });

    describe('the $match condition', function() {
      const start = '2020-05-01';
      const end = '2020-05-31';

      it('should select queries according to start and end dates', function(done) {
        TicketMock.aggregate = sinon.spy(pipeline => {
          const groupStage = pipeline.find(stage => !!stage.$match);

          expect(groupStage.$match['timestamps.createdAt']).to.deep.equal(
            {
              $gte: new Date(start),
              $lte: new Date('2020-06-01')
            });
          done();
        });

        getModule()
          .processDashboardQuery({query: { queryId: queryWithGroup, start, end }, user, ticketingUser})
          .catch(done);
      });

      it('should select queries according to allowed contracts', function(done) {
        TicketMock.aggregate = sinon.spy(pipeline => {
          const groupStage = pipeline.find(stage => !!stage.$match);

          expect(groupStage.$match.contract).to.deep.equal({ $in: [mongoose.Types.ObjectId(contract1), mongoose.Types.ObjectId(contract2)] });
          done();
        });

        getModule()
          .processDashboardQuery({query: { queryId: queryWithGroup, start, end }, user, ticketingUser})
          .catch(done);
      });

      it('should select queries according to allowed contracts and contracts param', function(done) {
        TicketMock.aggregate = sinon.spy(pipeline => {
          const groupStage = pipeline.find(stage => !!stage.$match);

          expect(groupStage.$match.contract).to.deep.equal({ $in: [mongoose.Types.ObjectId(contract1)] });
          done();
        });

        getModule()
          .processDashboardQuery({query: { queryId: queryWithGroup, start, end, contracts: [contract1] }, user, ticketingUser})
          .catch(done);
      });
    });

    describe('the final stages', function() {
      const start = '2020-05-01';
      const end = '2020-05-31';

      it('should add final stages if any', function(done) {
        TicketMock.aggregate = sinon.spy(pipeline => {
          const finalStage = pipeline.pop();

          expect(finalStage.$project).to.exist;
          done();
        });

        getModule()
          .processDashboardQuery({query: { queryId: queryWithFinalStages, start, end }, user, ticketingUser})
          .catch(done);
      });
    });

  });
});
