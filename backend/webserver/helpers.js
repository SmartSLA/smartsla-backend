'use strict';

module.exports = {

  createErrorMessage: function(error, errDetail) {
    return {
      error: {
        code: 500,
        message: 'Server Error',
        details: errDetail || error.message
      }
    };
  }
};
