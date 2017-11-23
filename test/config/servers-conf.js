'use strict';

const DEFAULT_PORTS = {
  express: 23455
};

module.exports = {
  host: process.env.HOSTNAME || process.env.DOCKER_HOST || 'localhost',

  express: {
    port: process.env.PORT_EXPRESS || DEFAULT_PORTS.express
  },

  redis: {
    host: 'redis',
    port: 6379,
    url: 'redis://redis:6379'
  },

  mongodb: {
    host: 'mongo',
    port: 27017,
    connectionString: 'mongodb://mongo/tests'
  },

  elasticsearch: {
    host: 'elasticsearch',
    port: 9200,
    interval_index: 1500
  },
  rabbitmq: {
    host: 'rabbitmq',
    port: 5672,
    url: 'amqp://rabbitmq:5672'
  }
};
