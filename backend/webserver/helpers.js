'use strict';

module.exports = {

  createErrorMessage: function(error, errDetail) {
    return {
      error: {
        code: 500,
        message: errDetail || 'Server Error',
        details: error.message
      }
    };
  }
};
