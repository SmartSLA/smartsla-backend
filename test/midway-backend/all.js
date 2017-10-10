'use strict';

const mockery = require('mockery');
const chai = require('chai');
const path = require('path');
const fs = require('fs-extra');
const mongoose = require('mongoose');
const testConfig = require('../config/servers-conf');
const basePath = path.resolve(__dirname + '/../../node_modules/linagora-rse');
const tmpPath = path.resolve(__dirname + '/../..', testConfig.tmp);
const backendPath = path.normalize(__dirname + '/../../backend');
const host = testConfig.host;
const MODULE_NAME = 'linagora.esn.ticketing';
let rse;

before(function(done) {
  mongoose.Promise = require('q').Promise;

  chai.use(require('chai-shallow-deep-equal'));
  chai.use(require('sinon-chai'));
  chai.use(require('chai-as-promised'));

  this.testEnv = {
    serversConfig: testConfig,
    basePath: basePath,
    tmp: tmpPath,
    backendPath: backendPath,
    fixtures: path.resolve(basePath, 'test/midway-backend/fixtures'),
    mongoUrl: 'mongodb://' + host + ':' + testConfig.mongodb.port + '/' + testConfig.mongodb.dbname,
    writeDBConfigFile() {
      fs.writeFileSync(tmpPath + '/db.json', JSON.stringify({connectionString: 'mongodb://' + host + ':' + testConfig.mongodb.port + '/' + testConfig.mongodb.dbname, connectionOptions: {auto_reconnect: false}}));
    },
    removeDBConfigFile() {
      fs.unlinkSync(tmpPath + '/db.json');
    },
    initCore(callback) {
      mongoose.Promise = require('q').Promise;
      rse.core.init(() => { callback && process.nextTick(callback); });
    }
  };

  process.env.NODE_CONFIG = this.testEnv.tmp;
  process.env.NODE_ENV = 'test';

  fs.copySync(this.testEnv.fixtures + '/default.mongoAuth.json', this.testEnv.tmp + '/default.json');

  rse = require('linagora-rse');
  this.helpers = {};

  this.testEnv.moduleManager = rse.moduleManager;
  rse.test.helpers(this.helpers, this.testEnv);
  rse.test.moduleHelpers(this.helpers, this.testEnv);
  rse.test.apiHelpers(this.helpers, this.testEnv);

  const manager = this.testEnv.moduleManager.manager;
  const loader = manager.loaders.code(require('../../index.js'), true);

  manager.appendLoader(loader);
  loader.load(MODULE_NAME, done);
});

// https://github.com/mfncooper/mockery/issues/34
before(function() {
  require('canvas');
  require('ursa');
});

after(function() {
  try {
    fs.unlinkSync(this.testEnv.tmp + '/default.json');
  } catch (e) {
    console.error(e);
  }
  delete process.env.NODE_CONFIG;
  delete process.env.NODE_ENV;
});

beforeEach(function() {
  mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
  this.testEnv.writeDBConfigFile();
});

afterEach(function() {
  try {
    this.testEnv.removeDBConfigFile();
  } catch (e) {
    console.error(e);
  }
  mockery.resetCache();
  mockery.deregisterAll();
  mockery.disable();
});
