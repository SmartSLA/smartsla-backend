'use strict';

const mockery = require('mockery');
const chai = require('chai');
const path = require('path');
const fs = require('fs-extra');
const testConfig = require('../config/servers-conf');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const redis = require('redis');

before(function() {
  chai.use(require('chai-shallow-deep-equal'));
  chai.use(require('sinon-chai'));
  chai.use(require('chai-as-promised'));
  const basePath = path.resolve(__dirname + '/../..');
  const tmpPath = path.resolve(basePath, testConfig.tmp);
  const host = testConfig.host;
  const testEnv = this.testEnv = {
    serversConfig: testConfig,
    basePath: basePath,
    tmp: tmpPath,
    fixtures: path.resolve(__dirname + '/fixtures'),
    mongoUrl: 'mongodb://' + host + ':' + testConfig.mongodb.port + '/' + testConfig.mongodb.dbname,
    writeDBConfigFile: function() {
      fs.writeFileSync(tmpPath + '/db.json', JSON.stringify({connectionString: 'mongodb://' + host + ':' + testConfig.mongodb.port + '/' + testConfig.mongodb.dbname, connectionOptions: {auto_reconnect: false}}));
    },
    removeDBConfigFile: function() {
      fs.unlinkSync(tmpPath + '/db.json');
    }
  };
  const self = this;

  this.helpers = {};
  this.helpers.loadApplication = function(dependencies) {
    const lib = require('../../backend/lib')(dependencies);

    const mongoose = dependencies('db').mongo.mongoose;
    const ObjectId = mongoose.Schema.ObjectId;

    mongoose.model('User', new mongoose.Schema({
      _id: {type: ObjectId, required: true},
      username: {type: String, required: true}
    }));

    const api = require('../../backend/webserver/api')(dependencies, lib);
    const app = require('../../backend/webserver/application')(dependencies);

    app.use(bodyParser.json());
    app.use('/api', api);

    return {
      express: app,
      lib: lib,
      api: api
    };
  };

  this.helpers.resetRedis = function(callback) {
    const redisClient = redis.createClient(testEnv.redisPort);

    return redisClient.flushall(callback);
  };

  this.helpers.mongo = {
    dropDatabase: function(callback) {
      function _dropDatabase() {
        MongoClient.connect(self.testEnv.mongoUrl, function(err, db) {
          if (err) {
            return callback(err);
          }
          db.dropDatabase(function(err) {
            if (err) {
              console.warn('Error while droping the database, retrying...', err);

              return _dropDatabase();
            }
            db.close(callback);
          });
        });
      }
      _dropDatabase();
    }
  };

  process.env.NODE_CONFIG = this.testEnv.tmp;
  process.env.NODE_ENV = 'test';
});

after(function() {
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
