const { expect } = require('chai');

describe('The filter module', function() {
  let moduleHelpers, filterModule, filterList;

  beforeEach(function() {
    moduleHelpers = this.moduleHelpers;
    filterModule = require(moduleHelpers.backendPath + '/lib/filter');
    filterList = require(moduleHelpers.backendPath + '/lib/filter/constants').FILTER_LIST;
  });

  describe('The list function', function() {
    it('should return array of filters', function(done) {
      filterModule.list()
        .then(filters => {
          expect(filters).to.be.an('array');
          expect(filters.length).to.be.equal(filterList.length);

          done();
        })
        .catch(done);
    });

    it('should return filters with id and name properties', function(done) {
      filterModule.list()
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
