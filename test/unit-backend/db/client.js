'use strict';

const expect = require('chai').expect;

describe('The linagora.esn.ticketing db model', function() {

  let clientDBModule, deps;

  function dependencies(name) {
    return deps[name];
  }

  beforeEach(function() {
    deps = this.deps;

    clientDBModule = require(this.moduleHelpers.backendPath + '/lib')(dependencies);
  });

  it('should expose the client model', function() {
    expect(clientDBModule.models.client).to.exist;
    expect(clientDBModule.models.client).to.be.an.instanceof(deps.db.mongo.mongoose.Schema);
  });
});
