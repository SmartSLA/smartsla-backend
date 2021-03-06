'use strict';

const { DEFAULT_LIST_OPTIONS, EVENTS, TICKETING_CONTRACT_ROLES, ALL_CONTRACTS } = require('../constants');
const DEFAULT_CONTRACT_POPULATE = 'software.software';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Contract = mongoose.model('Contract');
  const TicketingUserContract = mongoose.model('TicketingUserContract');
  const ticketingUserRole = require('../ticketing-user-role')(dependencies);
  const pubsubLocal = dependencies('pubsub').local;
  const search = require('./search')(dependencies);
  const lininfosec = require('../lininfosec/lininfosec')(dependencies);

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
    allowedContracts,
    create,
    getById,
    list,
    listByClient,
    listByCursor,
    search,
    updateById,
    removeById,
    addUsers,
    getUsers,
    getUserRoleInContract,
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

        return lininfosec.isEnabled()
          .then(enabled => {
            if (enabled) {
              return lininfosec.onContractUpdate(null, createdContract);
            }
          })
          .then(function() {
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

    return Contract
      .find()
      .populate(DEFAULT_CONTRACT_POPULATE)
      .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
      .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
      .sort('-timestamps.creation')
      .exec();
  }

  /**
   * List contracts by client
   * @param {String} clientId - the client Id
   * @returns {Promise}       - Resolve on success
   */
  function listByClient(clientId) {
    return Contract
      .find({ clientId })
      .populate(DEFAULT_CONTRACT_POPULATE)
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
        { $set: modified }
      )
      .exec()
      .then(oldContract => {
        if (modified) {
          contractUpdatedTopic.publish(modified);
        }

        return lininfosec.isEnabled()
          .then(enabled => {
            if (enabled) {
              return lininfosec.onContractUpdate(oldContract, modified);
            }
          })
          .then(function() {
            return modified;
          });

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

        return lininfosec.isEnabled()
          .then(enabled => {
            if (enabled) {
              return lininfosec.onContractUpdate(deletedContract, null);
            }
          })
          .then(function() {
            return deletedContract;
          });
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
      role: user.role || TICKETING_CONTRACT_ROLES.VIEWER
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

    return _removeUser(user).then(() => {
      Promise.all(contracts.map(contract => addUsers(contract.contract_id, [{ user: userId, role: contract.role }])))
        .then(() => user);
    });
  }

  function _removeUser(user) {
    const userId = user.user;

    return TicketingUserContract.remove({ user: userId }).exec();
  }

  function allowedContracts({ user, ticketingUser }) {
    return ticketingUserRole.userIsAdministratorOrExpert(user, ticketingUser)
      .then(canSeeAll => {
        const { role } = ticketingUser;

        if (canSeeAll) {
          return Promise.resolve(ALL_CONTRACTS);
        }

        if (role === TICKETING_CONTRACT_ROLES.CONTRACT_MANAGER) {
          return clientContractsList(ticketingUser);
        }

        return userContractsList();
      });

    function userContractsList() {
      return listForUser(user._id).then(contractRelations => contractRelations.map(relation => relation.contract));
    }

    function clientContractsList({ client }) {
      return listByClient(client).then(contracts => contracts.map(contract => contract._id));
    }
  }

  function getUserRoleInContract(contractId, userId) {
    return TicketingUserContract.findOne({ user: userId, contract: contractId }).then(relation => {
      if (relation) {
        return relation.role;
      }

      return false;
    });
  }
};
