'use strict';

module.exports = function(dependencies) {
  const mongoose = dependencies('db').mongo.mongoose;
  const pubsubLocal = dependencies('pubsub').local;
  const Team = mongoose.model('Team');
  const { DEFAULT_LIST_OPTIONS, EVENTS } = require('../constants');

  const teamCreatedTopic = pubsubLocal.topic(EVENTS.TEAM.created);
  const teamUpdatedTopic = pubsubLocal.topic(EVENTS.TEAM.updated);
  const teamDeletedTopic = pubsubLocal.topic(EVENTS.TEAM.deleted);

  return {
    create,
    getById,
    getByName,
    list,
    listByCursor,
    updateById,
    removeById
  };

  /**
   * Create a team
   * @param {Object}  Team - The team object
   * @param {Promise}          - Resolve on success
   */
  function create(team) {
    team = team instanceof Team ? team : new Team(team);

    return Team.create(team)
      .then(createdTeam => {
        teamCreatedTopic.publish(createdTeam);

        return createdTeam;
      });
  }

  /**
   * List team
   * @param {Object}   options  - The options object, may contain offset and limit
   * @param {Promise}           - Resolve on success
   */
  function list(options = {}) {

    return Team
      .find()
      .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
      .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
      .sort('-timestamps.creation')
      .exec();
  }

  /**
   * Update a team by ID
   * @param {String}   teamId - The team ID
   * @param {Object}   modified   - The modified team object
   * @param {Promise}             - Resolve on success with the number of documents selected for update
   */
  function updateById(teamId, modified) {
    return Team.update({ _id: teamId }, { $set: modified }).exec()
      .then(updatedResult => {
        // updatedResult: { "ok" : 1, "nModified" : 1, "n" : 1 }
        // updatedResult.n: The number of documents selected for update
        // http://mongoosejs.com/docs/api.html#model_Model.update
        if (updatedResult.n) {
          modified._id = modified._id || teamId;
          teamUpdatedTopic.publish(modified);
        }

        return updatedResult.n;
      });
  }

  /**
   * Get a team by name insensitive lowercase and uppercase
   * @param {String}   name - The team name
   * @param {Promise}       - Resolve on success
   */
  function getByName(name) {
    return Team.findOne({ name: new RegExp(`^${name}$`, 'i') });
  }

  /**
   * Get a team by ID
   * @param {String}   teamId - The team ID
   * @param {Promise}             - Resolve on success
   */
  function getById(teamId) {
    return Team
      .findById(teamId)
      .exec();
  }

  /**
   * List team using cursor
   * @param {Promise} - Resolve on success with a cursor object
   */
  function listByCursor() {
    return Team.find().cursor();
  }

  /**
   * Remove team by ID
   */
  function removeById(teamId) {
    return Team
    .findByIdAndRemove(teamId)
    .then(deletedTeam => {
      if (deletedTeam) {
        teamDeletedTopic.publish(deletedTeam);
      }

      return deletedTeam;
    });
  }

};
