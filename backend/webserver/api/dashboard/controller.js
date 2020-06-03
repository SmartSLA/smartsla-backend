'use strict';

module.exports = function(dependencies, lib) {
  return {
    get
  };

  function get(req, res) {
    lib.dashboard.processDashboardQuery(req)
    .then(results => {
      res.status(200).json(results);
    });
  }
};
