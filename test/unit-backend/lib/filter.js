const { expect } = require('chai');

describe('The filter module', function() {
  let moduleHelpers, filterModule, filterList, ticketingUser;

  beforeEach(function() {
    moduleHelpers = this.moduleHelpers;
    filterModule = require(moduleHelpers.backendPath + '/lib/filter');
    filterList = require(moduleHelpers.backendPath + '/lib/filter/constants').FILTER_LIST;
    ticketingUser = {
      user: '5e204f99cdc2b21444f07bdd',
      _id: '5e204fa9cdc2b21444f07be4',
      type: 'expert'
    };
  });

  describe('The list function', function() {
    it('should return array of filters', function(done) {
      filterModule.list({ticketingUser})
        .then(filters => {
          const { type } = ticketingUser;
          const filterListExpert = filterList.filter(filter => {
            if (filter.rights && !filter.rights.includes(type)) {
              return false;
            }

            return true;
          });

          expect(filters).to.be.an('array');
          expect(filters.length).to.be.equal(filterListExpert.length);

          done();
        })
        .catch(done);
    });

    it('should return filters with id and name properties', function(done) {
      filterModule.list({ticketingUser})
        .then(filters => {
          filters.forEach(filter => {
            expect(Object.keys(filter)).to.have.members(['_id', 'name']);

          });

          done();
        })
        .catch(done);
    });
  });

  describe('The getById function', function() {
    it('should return filter with id, name, query properties', function(done) {
      filterModule.getById('closed')
        .then(filter => {
            expect(Object.keys(filter)).to.have.members(['_id', 'name', 'query']);

            done();
          })
        .catch(done);
    });
  });
});
