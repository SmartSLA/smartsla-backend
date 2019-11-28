'use strict';

module.exports = function(dependencies) {
  const mongoose = dependencies('db').mongo.mongoose;
  const pubsubLocal = dependencies('pubsub').local;
  const Client = mongoose.model('Client');
  const Contract = mongoose.model('Contract');
  const { DEFAULT_LIST_OPTIONS, EVENTS } = require('../constants');

  const clientCreatedTopic = pubsubLocal.topic(EVENTS.CLIENT.created);
  const clientUpdatedTopic = pubsubLocal.topic(EVENTS.CLIENT.updated);
  const clientDeletedTopic = pubsubLocal.topic(EVENTS.CLIENT.deleted);

  return {
    create,
    getById,
    getByName,
    list,
    listByCursor,
    updateById,
    removeById
  };

  /**
   * Create a client
   * @param {Object}  Client - The client object
   * @param {Promise}          - Resolve on success
   */
  function create(client) {
    client = client instanceof Client ? client : new Client(client);

    return Client.create(client)
      .then(createdClient => {
        clientCreatedTopic.publish(createdClient);

        return createdClient;
      });
  }

  /**
   * List client
   * @param {Object}   options  - The options object, may contain offset and limit
   * @param {Promise}           - Resolve on success
   */
  function list(options = {}) {

    return Client
      .find()
      .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
      .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
      .sort('-timestamps.creation')
      .exec();
  }

  /**
   * Update a client by ID
   * @param {String}   clientId - The client ID
   * @param {Object}   modified   - The modified client object
   * @param {Promise}             - Resolve on success with the number of documents selected for update
   */
  function updateById(clientId, modified) {
    return Client.update({ _id: clientId }, { $set: modified }).exec()
      .then(updatedResult => {
        // updatedResult: { "ok" : 1, "nModified" : 1, "n" : 1 }
        // updatedResult.n: The number of documents selected for update
        // http://mongoosejs.com/docs/api.html#model_Model.update
        if (updatedResult.n) {
          modified._id = modified._id || clientId;
          clientUpdatedTopic.publish(modified);
        }

        return updatedResult.n;
      });
  }

  /**
   * Get a client by name insensitive lowercase and uppercase
   * @param {String}   name - The client name
   * @param {Promise}       - Resolve on success
   */
  function getByName(name) {
    return Client.findOne({ name: new RegExp(`^${name}$`, 'i') });
  }

  /**
   * Get a client by ID
   * @param {String}   clientId - The client ID
   * @param {Promise}             - Resolve on success
   */
  function getById(clientId) {
    return Client
      .findById(clientId)
      .lean()
      .exec()
      .then(client =>
        Contract.find({ clientId: clientId })
          .exec()
          .then(contracts => {
            client.contracts = contracts.map(contract => ({_id: contract._id, name: contract.name}));

            return client;
          })
      );
  }

  /**
   * List client using cursor
   * @param {Promise} - Resolve on success with a cursor object
   */
  function listByCursor() {
    return Client.find().cursor();
  }

  /**
  * Remove client by ID
  * @param {String}   clientId - The software ID
  * @param {Promise}             - Resolve on success
  */
  function removeById(clientId) {
    return Client
      .findByIdAndRemove(clientId)
      .then(deletedClient => {
        if (deletedClient) {
          clientDeletedTopic.publish(deletedClient);
        }

        return deletedClient;
      });
  }

};
