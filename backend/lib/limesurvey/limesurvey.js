const axios = require('axios');

module.exports = dependencies => {
  const EsnConfig = dependencies('esn-config').EsnConfig;
  const logger = dependencies('logger');

  /**
   * Get limesurvey configuration.
   *
   * @return {Promise} resolve on success
   */
  function getConfig() {
    return new EsnConfig('smartsla-backend')
      .get('limesurvey')
      .then(config => {
        if (config && config.apiUrl) {
          return config;
        }

        logger.warn('No "limesurvey" configuration has been found');

        throw new Error('No "limesurvey" configuration has been found');
      });
  }

  /**
   * Generate a unqiue secure token for the issue
   * @return {String}         - Participants token
   */
  function generateToken(ticketId) {
    return `${Date.now()}_${ticketId}`;
  }

  /**
   * Get session key
   * @return {Promise}         - Resolve on success
   */
  function getSessionKey(apiUrl, surveyId, credentials) {
    return axios.post(apiUrl, {
      method: 'get_session_key',
      params: credentials,
      id: surveyId
    });
  }

  /**
   * Add participants to the survey
   * @return {Promise}         - Resolve on success
   */
  function createSurvey(ticketId) {
    return getConfig().then(config => {
      const { surveyId, apiUrl, username, password} = config;
      const generatedToken = generateToken(ticketId);
      let sessionKey = null;

      return new Promise(resolve => {
        getSessionKey(apiUrl, surveyId, [username, password])
          .then(({ data }) => {
            sessionKey = data.result;
            axios
              .post(apiUrl, {
                method: 'add_participants',
                params: [sessionKey, surveyId, [{ token: generatedToken }], false]
              })
              .then(() => resolve({ id: surveyId, token: generatedToken }));
          })
          .catch(e => {
            logger.warn('Unable to reach limesurvey server', e);
            resolve();
          });
      });
    })
    .catch(err => err);
  }

  return {
    createSurvey
  };
};
