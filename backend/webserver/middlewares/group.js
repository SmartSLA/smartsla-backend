'use strict';

module.exports = function(dependencies, lib) {

  const helpers = require('../helpers');

  function loadGroup(req, res, next, groupId) {
    lib.group.get(groupId).then(
      group => {
        if (!group) {
          res.status(404).json({
            error: {
              code: 404,
              message: 'Not found',
              details: 'Can not find group'
            }
          });
        }
        req.group = group;

        next();
      },
      err => res.status(500).json(helpers.createErrorMessage(err, 'Error while loading group'))
    );
  }

  return {
    loadGroup
  };
};
