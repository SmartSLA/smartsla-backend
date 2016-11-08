'use strict';

const expect = require('chai').expect;

describe('The linagora.esn.ticketing db group model', function() {

  let groupDBModule;

  beforeEach(function() {
    this.moduleHelpers.addDep('db', {
      mongo: {
        mongoose: require('mongoose'),
        schemas: {
          address: {}
        }
      }
    });

    groupDBModule = require(this.moduleHelpers.backendPath + '/lib')(this.moduleHelpers.dependencies);
  });

  it('should expose the group model', function() {
    expect(groupDBModule.models.group).to.exist;
    expect(new groupDBModule.models.group({
      name: 'datGroup',
      address: {
        street: 'datStreet',
        state: 'datState',
        zip_code: '2074',
        city: 'city of God',
        country: 'Konoha'
      },
      is_active: true,
      preferred_contact: 'Arthas',
      members: [{password: 'secret', accounts: 'accounts'}]
    })).to.be.an.instanceof(this.moduleHelpers.dependencies('db').mongo.mongoose.Model);
  });
});
