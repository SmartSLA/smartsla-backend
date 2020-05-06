'use strict';

module.exports = function(dependencies, lib) {
  return {
    list
  };

  /**
   * List filters
   * @param {Request} req
   * @param {Response} res
   */
  function list(req, res) {
    lib.filter.list()
    .then(filters => {
      res.status(200).json(filters);
    });
  }
};
