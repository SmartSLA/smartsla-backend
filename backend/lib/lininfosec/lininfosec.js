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
        if (config && config.apiUrl && config.lininfosec_auth_token) {
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

    // HashMaps {uid: lininfosecConfiguration}
    const oldSoftware = {};
    const newSoftware = {};

    // Filling oldSoftware
    oldSoftwareArray.forEach(function(oldSoftwareItem) {
      // Using contract id + software id for a unique identifier
      const uid = `${oldContract._id.toString()}-${oldSoftwareItem._id.toString()}`;

      oldSoftware[uid] = oldSoftwareItem.lininfosecConfiguration;
    });

    // Promises for LinInfoSec sync
    const actions = [];

    // Synchronisation of updates with LinInfoSec
    newSoftwareArray.forEach(function(newSoftwareItem) {
      const currentLinInfoSecConfiguration = newSoftwareItem.lininfosecConfiguration;

      // Using contract id + software id for a unique identifier
      logger.info('Generating lininfosec conf uid ', newContract._id, newSoftwareItem._id);
      const uid = `${newContract._id.toString()}-${newSoftwareItem._id.toString()}`;

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
    });

    // Synchronisation of removals with LinInfoSec
    Object.keys(oldSoftware).forEach(function(uid) {
      if (!(uid in newSoftware)) {
        actions.push(removeCpeConfiguration(uid));
      }
    });

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

    const reqData = {
      configurationUid: uid,
      cpes: cpes
    };

    return getConfig()
      .then(config =>
        axios({
          method: 'POST',
          baseURL: config.apiUrl,
          url: '/monitor/add',
          data: reqData,
        headers: {'X-Auth-Token': config.lininfosec_auth_token}
        })
          .catch(err => {
            logger.error('Error while adding CPE configuration', err);
            return err;
          })
      );
  }

  /**
   *  get a software cpe configuration in LinInfoSec
   *
   * @return {Promise} resolve on success with the software configuration, null if configuration doesn't exists.
   */
  function getByUid(uid) {
    const reqParams = {
      name: uid
    };

    return getConfig()
      .then(config =>
        axios({
          method: 'GET',
          baseURL: config.apiUrl,
          url: '/monitor/get',
          headers: {'X-Auth-Token': config.lininfosec_auth_token},
          params: reqParams
        })
          .then(res => res.data)
          .catch(err => {
            logger.info('Error while getting CPE configuration', err);
            return err;
          })
      );
  }

  /**
   *  Upsert a software cpe configuration in LinInfoSec
   *
   * @return {Promise} resolve on success
   */
  function upsertCpeConfiguration(uid, cpes) {
    return getByUid(uid)
      .then(config => {
        logger.info('Adding or updating CPE configuration ', config);
        if (config instanceof Error) {
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

    const reqData = {
      configurationUid: uid,
      cpes: cpes
    };

    return getConfig()
      .then(config =>
        axios({
          method: 'POST',
          baseURL: config.apiUrl,
          url: '/monitor/update',
          data: reqData,
          headers: {'X-Auth-Token': config.lininfosec_auth_token}
        })
          .then(res => res.data)
          .catch(err => {
            logger.error('Error while updating CPE configuration', err);
            return err;
          })
      );
  }

  /**
   *  Remove a software cpe configuration in LinInfoSec
   *
   * @return {Promise} resolve on success
   */
  function removeCpeConfiguration(uid) {
    const reqData = {
      configurationUid: uid
    };

    return getConfig()
      .then(config =>
        axios({
          method: 'POST',
          baseURL: config.apiUrl,
          url: '/monitor/remove',
          data: reqData,
          headers: {'X-Auth-Token': config.lininfosec_auth_token}
        })
          .then(res => res.data)
          .catch(err => {
            logger.error('Error while removing CPE configuration', err);
            return err;
          })
      );
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
