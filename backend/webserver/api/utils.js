'use strict';

module.exports = dependencies => {
  const logger = dependencies('logger');

  return {
    send200ListResponse,
    send200ItemCount,
    send500Error,
    send404Error,
    send403Error,
    send400Error
  };

  function send200ListResponse(list = [], res) {
    res.header('X-ESN-Items-Count', list.length);
    res.status(200).json(list);
  }

  function send200ItemCount(length = 0, res) {
    res.header('X-ESN-Items-Count', length);
    res.status(200).end();
  }

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

  function send404Error(details, res) {
    return res.status(404).json({
      error: {
        code: 404,
        message: 'Not Found',
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
