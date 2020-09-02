const axios = require('axios');
const _ = require('lodash');

module.exports = dependencies => {
  const EsnConfig = dependencies('esn-config').EsnConfig;
  const logger = dependencies('logger');

  /**
   * Get lininfosec configuration.
   *
   * @return {Promise} resolve on success
   */
  function getConfig() {
    return new EsnConfig('smartsla-backend')
      .get('lininfosec')
      .then(config => {
        if (config && config.apiUrl) {
          return config;
        }

        logger.warn('No "lininfosec" configuration has been found');

        throw new Error('No "lininfosec" configuration has been found');
      });
  }

  /**
   * Update a configuration in LinInfoSec
   * Takes the old version and the new version of the contract
   * and updates the LinInfoSec service accordingly
   *
   * null can be used as the oldContract to signify a contract being created
   * null can be used as the newContract to signify a contract being deleted
   *
   * @param {Object}   oldContract   - The previous version of the contract
   * @param {Object }  newContract   - The new contract
   * @return {Promise} resolve on success
   */
  function onContractUpdate(oldContract, newContract) {
    const oldSoftwareArray = oldContract && oldContract.software || [];
    const newSoftwareArray = newContract && newContract.software || [];

    const oldSoftware = {};
    const newSoftware = {};

    for (let i = 0; i < oldSoftwareArray.length; i++) {

      // Using contract id + software id for a unique identifier
      const uid = `${newContract._id.toString()}-${newSoftwareArray[i]._id.toString()}`;

      oldSoftware[uid] = oldSoftwareArray[i].lininfosecConfiguration;
    }

    //Promises for LinInfoSec sync
    const actions = [];

    for (let i = 0; i < newSoftwareArray.length; i++) {
      const currentLinInfoSecConfiguration = newSoftwareArray[i].lininfosecConfiguration;

      // Using contract id + software id for a unique identifier
      const uid = `${newContract._id.toString()}-${newSoftwareArray[i]._id.toString()}`;

      newSoftware[uid] = currentLinInfoSecConfiguration;

      if (uid in oldSoftware && !(_.isEqual(currentLinInfoSecConfiguration, oldSoftware[uid]))) {
        if (currentLinInfoSecConfiguration.length === 0) {
          actions.push(removeCpeConfiguration(uid));
        } else {
          actions.push(upsertCpeConfiguration(uid, currentLinInfoSecConfiguration));
        }
      } else if (!(uid in oldSoftware)) {
        actions.push(addCpeConfiguration(uid, currentLinInfoSecConfiguration));
      }
    }

    for (const [uid] of Object.entries(oldSoftware)) {
      if (!(uid in newSoftware)) {
        actions.push(removeCpeConfiguration(uid));
      }
    }

    return Promise.all(actions);
  }

  /**
   *  Add a software cpe configuration in LinInfoSec
   *
   * @return {Promise} resolve on success
   */
  function addCpeConfiguration(uid, cpes) {

     if (cpes.length === 0) {
       return Promise.resolve();
     }

    const data = {
      configurationUid: uid,
      cpes: cpes
    };

    return getConfig()
      .then(config => axios.post(config.apiUrl + '/monitor/add', data))
      .catch(error => {
         if (error.response) {
           logger.error(`Error adding a configuration to lininfosec: ${JSON.stringify({status: error.response.status, headers: error.response.headers, data: error.response.data})}`);
         } else {
           logger.error(error.message);
         }

         return null;
      });
  }

  /**
   *  get a software cpe configuration in LinInfoSec
   *
   * @return {Promise} resolve on success with the software configuration, null if configuration doesn't exists.
   */
  function getByUid(uid) {
    return getConfig()
      .then(config =>
        axios.get(config.apiUrl + '/monitor/get', { params: { name: uid }})
      )
      .then(res => res.data)
      .catch(() => null);
  }

  /**
   *  Update a software cpe configuration in LinInfoSec
   *
   * @return {Promise} resolve on success
   */
  function upsertCpeConfiguration(uid, cpes) {
    return getByUid(uid)
      .then(config => {
        if (config === null) {
          return addCpeConfiguration(uid, cpes);
        }

        return updateCpeConfiguration(uid, cpes);
      });
  }

  /**
   *  Update a software cpe configuration in LinInfoSec
   *
   * @return {Promise} resolve on success
   */
  function updateCpeConfiguration(uid, cpes) {
    if (cpes.length === 0) {
      return Promise.resolve();
    }

    const data = {
      configurationUid: uid,
      cpes: cpes
    };

    return getConfig()
      .then(config => axios.post(config.apiUrl + '/monitor/update', data))
      .catch(error => {
         if (error.response) {
           logger.error(`Error updating a configuration to lininfosec: ${JSON.stringify({status: error.response.status, headers: error.response.headers, data: error.response.data})}`);
         } else {
           logger.error(error.message);
         }

         return null;
      });
  }

  /**
   *  Remove a software cpe configuration in LinInfoSec
   *
   * @return {Promise} resolve on success
   */
  function removeCpeConfiguration(uid) {

    const data = {
      configurationUid: uid
    };

    return getConfig()
      .then(config => axios.post(config.apiUrl + '/monitor/remove', data))
      .catch(error => {
         if (error.response) {
           logger.error(`Error removing a configuration to lininfosec: ${JSON.stringify({status: error.response.status, headers: error.response.headers, data: error.response.data})}`);
         } else {
           logger.error(error.message);
         }

         return null;
      });
  }

  /**
   *  Check feature flag
   *
   * @return {Promise} resolve true if enabled
   */
  function isEnabled() {
    return new EsnConfig('smartsla-backend')
      .get('features')
      .then(config => config.isLinInfoSecEnabled);
  }

  return {
    onContractUpdate,
    isEnabled
  };
};
