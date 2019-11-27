'use strict';

const { DEFAULT_LIST_OPTIONS, EVENTS } = require('../constants');
const DEFAULT_CONTRACT_POPULATE = 'software.software';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Contract = mongoose.model('Contract');
  const TicketingUserContract = mongoose.model('TicketingUserContract');
  const pubsubLocal = dependencies('pubsub').local;
  const search = require('./search')(dependencies);

  const contractCreatedTopic = pubsubLocal.topic(EVENTS.CONTRACT.created);
  const contractUpdatedTopic = pubsubLocal.topic(EVENTS.CONTRACT.updated);
  const contractDeletedTopic = pubsubLocal.topic(EVENTS.CONTRACT.deleted);

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
    updateById,
    removeById,
    addUsers,
    getUsers,
    listForUser,
    updateUser
  };

  /**
   * Create an contract
   * @param {Object}  contract - The contract object
   * @param {Promise}          - Resolve on success
   */
  function create(contract) {
    const { clientId } = contract.client;
    const client = contract.client.name;

    let contractNormalized = { ...contract, clientId, client };

    contractNormalized = contractNormalized instanceof Contract ? contractNormalized : new Contract(contractNormalized);

    return Contract.create(contractNormalized)
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
      .populate(DEFAULT_CONTRACT_POPULATE)
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
    const query = Contract.findById(contractId).populate(DEFAULT_CONTRACT_POPULATE);

    query.populate(DEFAULT_CONTRACT_POPULATE);

    if (options.populations) {
      query.populate(options.populations);
    }

    return query.exec();
  }

  /**
  * Remove contract by ID
  * @param {String}   contractId - The software ID
  * @param {Promise}             - Resolve on success
  */
  function removeById(contractId) {
    return Contract
      .findByIdAndRemove(contractId)
      .then(deletedContract => {
        if (deletedContract) {
          contractDeletedTopic.publish(deletedContract);
        }

        return deletedContract;
      });
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

  function addUsers(contractId, users) {
    return TicketingUserContract.insertMany(users.map(user => ({
      user: user.user,
      contract: contractId,
      role: user.role || 'reader'
    })));
  }

  /**
   * Get all the contracts for a given user
   * @param {ObjectId} userId
   * @param {Object} populate (Mongoose populate options)
   * @returns Array of {user, contract, role}
   */
  function listForUser(userId, populate) {
    const query = TicketingUserContract.find({ user: userId });

    if (populate) {
      query.populate(populate);
    }

    return query.exec();
  }

  function getUsers(contractId, populates = []) {
    const query = TicketingUserContract.find({ contract: contractId });

    populates.forEach(populate => query.populate(populate));

    return query.exec();
  }

  function updateUser(user, contracts) {
    const userId = user.user;
    const { role } = user || 'reader';

    if (!contracts || !contracts.length) {
      return Promise.resolve(user);
    }

    return _removeUser(user).then(() => {
      Promise.all(contracts.map(contract => addUsers(contract, [{ user: userId, role }])))
        .then(() => user);
    });
  }

  function _removeUser(user) {
    const userId = user.user;

    return TicketingUserContract.remove({ user: userId }).exec();
  }
};
