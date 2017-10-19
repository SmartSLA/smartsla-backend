'use strict';

module.exports = dependencies => {
  const logger = dependencies('logger');

  return {
    send500Error,
    send403Error,
    send400Error
  };

  function send500Error(details, err, res) {
    logger.error(details, err);

    return res.status(500).json({
      error: {
        code: 500,
        message: 'Server Error',
        details
      }
    });
  }

  function send403Error(details, res) {
    return res.status(403).json({
      error: {
        code: 403,
        message: 'Forbidden',
        details
      }
    });
  }

  function send400Error(details, res) {
    return res.status(400).json({
      error: {
        code: 400,
        message: 'Bad Request',
        details
      }
    });
  }
};
