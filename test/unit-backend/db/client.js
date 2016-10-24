'use strict';

const expect = require('chai').expect;

describe('The linagora.esn.ticketing db model', function() {

  let clientDBModule;

  beforeEach(function() {

    this.moduleHelpers.addDep('db', {
      mongo: {
        mongoose: require('mongoose'),
        schemas: {
          address: {}
        }
      }
    });

    clientDBModule = require(this.moduleHelpers.backendPath + '/lib')(this.moduleHelpers.dependencies);
  });

  it('should expose the client model', function() {
    expect(clientDBModule.models.client).to.exist;
    expect(new clientDBModule.models.client({
      name: 'name',
      address: {
        street: '12 people street',
        state: 'NY',
        zip_code: '123',
        city: 'NY',
        country: 'USA'
      },
      access_code: '123',
      access_code_hint: '456'
    })).to.be.an.instanceof(this.moduleHelpers.dependencies('db').mongo.mongoose.Model);
  });
});
