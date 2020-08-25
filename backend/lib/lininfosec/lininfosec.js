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
   * Update or Registers a configuration to LinInfoSec
   *
   * @param {Object}   oldContract   - The previous version of the contract
   * @param {Object }  newContract   - The new contract
   * @return {Promise} resolve on success
   */
  function onContractAction(oldContract,newContract) {
    let oldSoftwareArray = oldContract&& oldContract.software ? oldContract.software : [];
    let newSoftwareArray = newContract&& newContract.software ? newContract.software : [];


    let oldSoftware = {};
    let newSoftware = {};

    for(let i = 0; i < oldSoftwareArray.length; i++) {
      if(oldSoftwareArray[i].lininfosecConfiguration.length === 0) {
        continue;
      }

      // Using contract id + software id for a unique identifier
      const uid = oldContract._id.toString() + "-" + oldSoftwareArray[i].software._id;
    
      oldSoftware[uid] = oldSoftwareArray[i].lininfosecConfiguration;
    }


    //Promises for LinInfoSec sync
    let actions = [];

    for(let i = 0; i < newSoftwareArray.length; i++) {
      if(newSoftwareArray[i].lininfosecConfiguration.length === 0) {
        continue;
      }


      // Using contract id + software id for a unique identifier
      const uid = newContract._id.toString() + "-" + newSoftwareArray[i].software._id;
      newSoftware[uid] = newSoftwareArray[i].lininfosecConfiguration;

      if(uid in oldSoftware && !(_.isEqual(newSoftwareArray[i].lininfosecConfiguration, oldSoftware[uid]))){
        actions.push(upsertConf(uid, newSoftwareArray[i].lininfosecConfiguration));
      } else if (!(uid in oldSoftware)) {
        actions.push(createConf(uid, newSoftwareArray[i].lininfosecConfiguration));
      };
    }


    for(let uid in oldSoftware) {
      if(!(uid in newSoftware)) {
        actions.push(removeConf(uid));
      }
    }

    
    return Promise.all(actions);
  }

  /**
   *  Create a software cpe configuration in LinInfoSec
   *
   * @return {Promise} resolve on success
   */
  function createConf(uid, cpes) {
    const data = {
      configuration: uid,
      cpes: cpes
    };


    return getConfig()
      .then(config => {
        return axios.post(config.apiUrl + "/monitor/add", data);
      })
      .catch(err => {
        logger.error(err);
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
      .then(config => {
        return axios.get(config.apiUrl + "/monitor/get", { params: { name: uid }});
      })
      .then(res => {
        return res.data;
      }).catch(err => {
        return null;
      });
  }

  /**
   *  Insert or update a software cpe configuration in LinInfoSec
   *
   * @return {Promise} resolve on success
   */
  function upsertConf(uid, cpes) {
    return getByUid(uid)
      .then(config => {
        if(config === null) {
          return createConf(uid,cpes);
        } else {
          return updateConf(uid,cpes);
        }
      });
  }

  /**
   *  Update a software cpe configuration in LinInfoSec
   *
   * @return {Promise} resolve on success
   */
  function updateConf(uid, cpes) {
    const data = {
      configuration: uid,
      cpes: cpes
    };


    return getConfig()
      .then(config => {
        return axios.post(config.apiUrl + "/monitor/update", data);
      })
      .catch(err => {
        logger.error(err);
        return null;
      });
  }

  /**
   *  Remove a software cpe configuration in LinInfoSec
   *
   * @return {Promise} resolve on success
   */
  function removeConf(uid) {
    const data = {
      configuration: uid,
    };

    return getConfig()
      .then(config => {
        return axios.post(config.apiUrl + "/monitor/remove", data);
      })
      .catch(err => {
        logger.error(err);
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
      .then(config => {
        return config["isLinInfoSecEnabled"];
      });
  }

  return {
    onContractAction,
    isEnabled
  };
};
