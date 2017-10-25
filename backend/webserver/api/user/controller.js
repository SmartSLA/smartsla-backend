'use strict';

module.exports = (dependencies, lib) => {
  const {
    send404Error,
    send500Error
  } = require('../utils')(dependencies);

  return {
    create,
    update
  };

  /**
   * Create Ticketing user.
   * @param  {Object} req
   * @param  {Object} res
   */
  function create(req, res) {
    lib.user.create(req.body)
      .then(createdUser => res.status(201).json(createdUser))
      .catch(err => send500Error('Failed to create Ticketing user', err, res));
  }

  /**
   * Update a user. Only allow update main phone and description now.
   * @param  {Object} req
   * @param  {Object} res
   */
  function update(req, res) {
    const modifiedUser = {
      main_phone: req.body.main_phone,
      description: req.body.description
    };

    lib.user.updateById(req.params.id, modifiedUser)
      .then(updatedResult => {
        if (!updatedResult) {
          return send404Error('User not found', res);
        }

        res.status(204).end();
      })
      .catch(err => send500Error('Failed to update Ticketing user', err, res));
  }
};
