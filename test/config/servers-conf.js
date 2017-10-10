'use strict';

const DEFAULT_PORTS = {
  express: 23455,
  mongo: 23456,
  redis: 23457
};
const tmp = 'tmp';
const host = process.env.HOSTNAME || process.env.DOCKER_HOST || 'localhost';
const dbName = 'tests';
const mongoPort = process.env.PORT_MONGODB || DEFAULT_PORTS.mongo;

module.exports = {
  tmp,

  default_ports: DEFAULT_PORTS,

  host,

  express: {
    port: process.env.PORT_EXPRESS || DEFAULT_PORTS.express
  },

  redis: {
    cmd: process.env.CMD_REDIS || 'redis-server',
    port: process.env.PORT_REDIS || DEFAULT_PORTS.redis,
    conf_file: '',
    log_path: '',
    pwd: ''
  },

  mongodb: {
    cmd: process.env.CMD_MONGODB || 'mongod',
    port: mongoPort,
    interval_replica_set: process.env.MONGODB_INTERVAL_REPLICA_SET || 1000,
    tries_replica_set: process.env.MONGODB_TRIES_REPLICA_SET || 20,
    connectionString: 'mongodb://' + host + ':' + mongoPort + '/' + dbName,
    replicat_set_name: 'rs',
    dbname: dbName,
    dbpath: tmp + '/mongo/',
    logpath: ''
  }
};
