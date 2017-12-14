'use strict';

const _ = require('lodash');
const Q = require('q');

const { DEFAULT_LIST_OPTIONS, EVENTS } = require('../constants');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Contract = mongoose.model('Contract');
  const pubsubLocal = dependencies('pubsub').local;
  const search = require('./search')(dependencies);

  const contractCreatedTopic = pubsubLocal.topic(EVENTS.CONTRACT.created);
  const contractUpdatedTopic = pubsubLocal.topic(EVENTS.CONTRACT.updated);

  const POPULATION_FOR_ELASTICSEARCH = [
    {
      path: 'software.template',
      select: 'name'
    },
    {
      path: 'organization',
      select: 'shortName'
    }
  ];

  return {
    addDemands,
    addSoftware,
    create,
    getById,
    list,
    listByCursor,
    search,
    updateById
  };

  /**
   * Create an contract
   * @param {Object}  contract - The contract object
   * @param {Promise}          - Resolve on success
   */
  function create(contract) {
    contract = contract instanceof Contract ? contract : new Contract(contract);

    return Contract.create(contract)
      .then(createdContract => {
        const contractToIndex = _.cloneDeep(createdContract);

        return Q.ninvoke(contractToIndex, 'populate', POPULATION_FOR_ELASTICSEARCH)
          .then(populatedContract => {
            contractCreatedTopic.publish(populatedContract);

            return createdContract;
          });
      });
  }

  /**
   * List contracts
   * @param {Object}   options  - The options object, may contain offset and limit
   * @param {Promise}           - Resolve on success
   */
  function list(options) {
    options = options || {};

    const findOptions = options.organization ? { organization: options.organization } : {};

    return Contract
      .find(findOptions)
      .populate(options.populations)
      .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
      .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
      .sort('-creation')
      .exec();
  }

  /**
   * Update a contract by ID
   * @param {String}   contractId - The contract ID
   * @param {Object}   modified   - The modified contract object
   * @param {Promise}             - Resolve on success with modified contract
   */
  function updateById(contractId, modified) {
    return Contract
      .findByIdAndUpdate(
        contractId,
        { $set: modified },
        { new: true }
      )
      .populate(POPULATION_FOR_ELASTICSEARCH)
      .exec()
        .then(modified => {
          if (modified) {
            contractUpdatedTopic.publish(modified);
          }

          return modified;
        });
  }

  /**
   * Add a software for a contract
   * @param {String}   contractId    - The contract ID
   * @param {Object}   softwareToAdd - The an array or a object of software to add
   * @param {Promise}                - Resolve on success with modified contract
   */
  function addSoftware(contractId, softwareToAdd) {
    softwareToAdd = Array.isArray(softwareToAdd) ? softwareToAdd : [softwareToAdd];

    return Contract
      .findByIdAndUpdate(
        contractId,
        { $addToSet: { software: { $each: softwareToAdd } } },
        { new: true }
      )
      .populate(POPULATION_FOR_ELASTICSEARCH)
      .exec()
        .then(modified => {
          if (modified) {
            contractUpdatedTopic.publish(modified);
          }

          return modified;
        });
  }

  /**
   * Add demands for a contract
   * @param {String}   contractId  - The contract ID
   * @param {Object}   demands     - The array of demands to add
   * @param {Promise}              - Resolve on success with modified contract
   */
  function addDemands(contractId, demands) {
    return Contract
      .findByIdAndUpdate(
        contractId,
        { $addToSet: { demands: { $each: demands } } },
        { new: true }
      )
      .populate(POPULATION_FOR_ELASTICSEARCH)
      .exec()
        .then(modified => {
          if (modified) {
            contractUpdatedTopic.publish(modified);
          }

          return modified;
        });
  }

  /**
   * Get an contract by ID
   * @param {String}   contractId - The contract ID
   * @param {Promise}             - Resolve on success
   */
  function getById(contractId, options = {}) {
    const query = Contract.findById(contractId);

    if (options.populations) {
      query.populate(options.populations);
    }

    return query.exec();
  }

  /**
   * List contracts using cursor
   * @param {Promise} - Resolve on success with a cursor object
   */
  function listByCursor() {
    return Contract
      .find()
      .populate(POPULATION_FOR_ELASTICSEARCH)
      .cursor();
  }
};
