'use strict';

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
        contractCreatedTopic.publish(createdContract);

        return createdContract;
      });
  }

  /**
   * List contracts
   * @param {Object}   options  - The options object, may contain offset and limit
   * @param {Promise}           - Resolve on success
   */
  function list(options) {
    options = options || {};

    return Contract
      .find()
      .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
      .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
      .sort('-timestamps.creation')
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
