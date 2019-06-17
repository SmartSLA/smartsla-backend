'use strict';

module.exports = function(dependencies, lib) {
  const { send404Error, send500Error } = require('../utils')(dependencies);

  return {
    create,
    get,
    list,
    update
  };

  /**
   * Create a team
   *
   * @param {Request} req
   * @param {Response} res
   */
  function create(req, res) {
    return lib.team.create(req.body)
      .then(createdTeam => res.status(201).json(createdTeam))
      .catch(err => send500Error('Failed to create team', err, res));
  }

  /**
   * list teams
   *
   * @param {Request} req
   * @param {Response} res
   */
  function list(req, res) {
    let getTeam;
    let errorMessage;

    if (req.query.search) {
      const options = {
        limit: +req.query.limit,
        offset: +req.query.offset,
        search: req.query.search,
        excludedIds: req.query.excludedIds
      };

      errorMessage = 'Error while searching team';
      getTeam = lib.team.search(options);
    } else if (req.query.name) {
      errorMessage = `Failed to get team ${req.query.name}`;
      getTeam = lib.team.getByName(req.query.name)
        .then(team => {
          const list = team ? [team] : [];

          return {
            total_count: list.length,
            list
          };
        });
    } else {
      const options = {
        limit: +req.query.limit,
        offset: +req.query.offset
      };

      errorMessage = 'Failed to list team';
      getTeam = lib.team.list(options)
        .then(team => ({
          total_count: team.length,
          list: team
        }));
    }

    return getTeam
      .then(result => {
        res.header('X-ESN-Items-Count', result.total_count);
        res.status(200).json(result.list);
      })
      .catch(err => send500Error(errorMessage, err, res));
  }

  /**
   * Get a Team
   *
   * @param {Request} req
   * @param {Response} res
   */
  function get(req, res) {
    return lib.team.getById(req.params.id)
      .then(team => {
        team = team.toObject();

        return res.status(200).json(team);

      })
      .catch(err => send500Error('Failed to get software', err, res));
  }

  /**
   * Update a team
   *
   * @param {Request} req
   * @param {Response} res
   */
  function update(req, res) {
    return lib.team.updateById(req.params.id, req.body)
      .then(numberOfUpdatedDocs => {
        if (numberOfUpdatedDocs) {
          return res.status(204).end();
        }

        return send404Error('team not found', res);
      })
      .catch(err => send500Error('Failed to update team', err, res));
  }
};
