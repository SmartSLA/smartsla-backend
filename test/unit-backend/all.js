'use strict';

const mockery = require('mockery');
const chai = require('chai');
const path = require('path');

before(function() {
  chai.use(require('chai-shallow-deep-equal'));
  chai.use(require('sinon-chai'));
  chai.use(require('chai-as-promised'));
  this.helpers = {};
});

beforeEach(function() {
  mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
  const depsStore = {
    logger: require('./fixtures/logger-noop'),
    errors: require('./fixtures/errors')
  };
  const dependencies = name => depsStore[name];

  const addDep = (name, dep) => {
    depsStore[name] = dep;
  };

  const mockModels = mockedModels => {
    const types = {
      ObjectId: function(id) {
        return {id: id};
      },
      Mixed: ''
    };

    const schema = function() {};

    schema.Types = types;

    const mongooseMock = {
      Types: types,
      Schema: schema,
      model: function(model) {
        return mockedModels[model];
      },
      __replaceObjectId: function(newObjectId) {
        types.ObjectId = newObjectId;
      }
    };

    mockery.registerMock('mongoose', mongooseMock);

    return this.moduleHelpers.addDep('db', {
      mongo: {
        mongoose: require('mongoose')
      }
    });
  };

  this.moduleHelpers = {
    backendPath: path.normalize(__dirname + '/../../backend'),
    addDep,
    dependencies,
    mockModels
  };
});

afterEach(function() {
  mockery.resetCache();
  mockery.deregisterAll();
  mockery.disable();
});
