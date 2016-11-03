'use strict';

module.exports = {
  send(res, code, error) {
    res.json(code, error);
  }
};
