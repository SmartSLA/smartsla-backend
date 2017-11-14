'use strict';

const chai = require('chai');
const path = require('path');
const mockery = require('mockery');
const testConfig = require('../config/servers-conf');
const basePath = path.resolve(__dirname + '/../../node_modules/linagora-rse');
const backendPath = path.normalize(__dirname + '/../../backend');
const MODULE_NAME = 'linagora.esn.ticketing';
let rse;

before(function(done) {
  chai.use(require('chai-shallow-deep-equal'));
  chai.use(require('sinon-chai'));
  chai.use(require('chai-as-promised'));

  this.testEnv = {
    serversConfig: testConfig,
    basePath: basePath,
    backendPath: backendPath,
    fixtures: path.resolve(basePath, 'test/midway-backend/fixtures'),
    mongoUrl: testConfig.mongodb.connectionString,
    initCore(callback) {
      rse.core.init(() => { callback && process.nextTick(callback); });
    }
  };

  process.env.NODE_CONFIG = 'test/config';
  process.env.NODE_ENV = 'test';
  process.env.REDIS_HOST = 'redis';
  process.env.REDIS_PORT = 6379;
  process.env.AMQP_HOST = 'rabbitmq';
  process.env.ES_HOST = 'elasticsearch';

  this.connectMongoose = function(mongoose, done) {
    mongoose.Promise = require('q').Promise; // http://mongoosejs.com/docs/promises.html
    mongoose.connect(this.testEnv.mongoUrl, done);
  };

  rse = require('linagora-rse');
  this.helpers = {};

  this.testEnv.core = rse.core;
  this.testEnv.moduleManager = rse.moduleManager;
  rse.test.helpers(this.helpers, this.testEnv);
  rse.test.moduleHelpers(this.helpers, this.testEnv);
  rse.test.apiHelpers(this.helpers, this.testEnv);

  const manager = this.testEnv.moduleManager.manager;
  const nodeModulesPath = path.normalize(
    path.join(__dirname, '../../node_modules/')
  );
  const nodeModulesLoader = manager.loaders.filesystem(nodeModulesPath, true);
  const loader = manager.loaders.code(require('../../index.js'), true);

  manager.appendLoader(nodeModulesLoader);
  manager.appendLoader(loader);
  loader.load(MODULE_NAME, done);
});

beforeEach(function() {
  mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
  const depsStore = {
    db: require('linagora-rse/backend/core/db')
  };
  const dependencies = function(name) {
    return depsStore[name];
  };

  this.moduleHelpers = {
    dependencies
  };
});
