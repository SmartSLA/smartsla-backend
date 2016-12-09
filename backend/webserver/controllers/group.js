'use strict';

module.exports = function(dependencies, lib) {

  const helpers = require('../helpers');
  const _ = require('lodash');
  const q = require('q');

  function getGroupFromReq(req) {
    const group = {
      name: req.body.name,
      preferred_contact: req.body.preferred_contact,
      address: req.body.address,
      is_active: req.body.is_active,
      members: req.body.members
    };

     return _.omitBy(group, _.isUndefined);
  }

  function getGroup(req, res) {
    res.status(200).json(req.group);
  }

  function listGroups(req, res) {
    const option = req.query.option ? JSON.parse(req.query.option) : {};

    lib.group.list(option).then(
      result => res.status(200).json(result),
      err => res.status(500).json(helpers.createErrorMessage(err, 'Error while listing groups'))
    );
  }

  function createGroup(req, res) {
    const group = getGroupFromReq(req);

    lib.group.create(group).then(
      result => res.status(201).json(result),
      err => res.status(500).json(helpers.createErrorMessage(err, 'Error while creating group'))
    );
  }

  function updateGroup(req, res) {
    const group = getGroupFromReq(req);
    const mongooseConditions = {
      _id: req.params.groupId
    };

    lib.group.update(mongooseConditions, group).then(
      result => res.status(200).json(result),
      err => res.status(500).json(helpers.createErrorMessage(err, 'Error while updating the group'))
    );
  }

  function removeGroup(req, res) {
    const mongooseConditions = {
      _id: req.params.groupId
    };

    return lib.group.remove(mongooseConditions).then(
      () => res.status(204).end(),
      err => {
        res.status(500).json(helpers.createErrorMessage(err, 'Error while deleting the group'));

        return q.reject(err);
      }
    );
  }

  function removeGroups(req, res) {
    const groupIds = !Array.isArray(req.body.groupIds) ? Array.of(req.body.groupIds) : req.body.groupIds;

    return q.allSettled(
      groupIds.map(
        groupId => lib.group.remove(groupId)
      )
    ).then(
      result => res.status(200).json(result),
      err => res.status(500).json(helpers.createErrorMessage(err, 'Error while deleting the groups'))
    );
  }

  return {
    getGroup,
    listGroups,
    createGroup,
    updateGroup,
    removeGroup,
    removeGroups
  };
};
