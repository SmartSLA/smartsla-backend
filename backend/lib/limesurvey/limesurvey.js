const axios = require('axios');
const { API_URL, SURVEY_ID, CREDENTIALS } = require('../constants.js').LIMESURVEY;

module.exports = {
    createSurvey
};

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
function getSessionKey() {
  const params = Object.values(CREDENTIALS);
  return axios.post(API_URL, {
    method: 'get_session_key',
    params,
    id: SURVEY_ID
  });
}

/**
 * Add participants to the survey
 * @return {Promise}         - Resolve on success
 */
function createSurvey(ticketId) {
  const id = SURVEY_ID;
  const generatedToken = generateToken(ticketId);
  let sSessionKey = null;

  return new Promise((resolve, reject) => {
    getSessionKey()
      .then(({ data }) => {
        sSessionKey = data.result;
        axios
          .post(API_URL, {
            method: 'add_participants',
            params: [sSessionKey, SURVEY_ID, [{ token: generatedToken }], false]
          })
          .then(() => resolve({ id, token: generatedToken }));
      })
      .catch(reject);
  });
}
