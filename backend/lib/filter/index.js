'use strict';

module.exports = function(dependencies) {
    const mongoose = dependencies('db').mongo.mongoose;
    const pubsubLocal = dependencies('pubsub').local;
    const Filter = mongoose.model('TicketFilter');
    const { DEFAULT_LIST_OPTIONS, EVENTS } = require('../constants');

    const filterCreatedTopic = pubsubLocal.topic(EVENTS.FILTER.created);
    const filterUpdatedTopic = pubsubLocal.topic(EVENTS.FILTER.updated);
    const filterDeletedTopic = pubsubLocal.topic(EVENTS.FILTER.deleted);

    return {
        create,
        getById,
        list,
        listByCursor,
        updateById,
        removeById
    };

    /**
     * Create a filter
     * @param {Object}  Filter - The client object
     * @param {Promise}          - Resolve on success
     */
    function create(filter) {
        filter = filter instanceof Filter ? filter : new Filter(filter);

        return Filter.create(filter)
            .then(createdFilter => {
                filterCreatedTopic.publish(createdFilter);

                return createdFilter;
            });
    }

    /**
     * List filter
     * @param {Object}   options  - The options object, may contain offset and limit
     * @param {Promise}           - Resolve on success
     */
    function list(options = {}) {

        return Filter
            .find({user: options.user})
            .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
            .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
            .sort('-timestamps.creation')
            .exec();
    }

    /**
     * Update a filter by ID
     * @param {String}   filterId - The filter ID
     * @param {Object}   modified   - The modified filter object
     * @param {Promise}             - Resolve on success with the number of documents selected for update
     */
    function updateById(filterId, modified) {
        return Filter.update({ _id: filterId }, { $set: modified }).exec()
            .then(updatedResult => {
                // updatedResult: { "ok" : 1, "nModified" : 1, "n" : 1 }
                // updatedResult.n: The number of documents selected for update
                // http://mongoosejs.com/docs/api.html#model_Model.update
                if (updatedResult.n) {
                    modified._id = modified._id || filterId;
                    filterUpdatedTopic.publish(modified);
                }

                return updatedResult.n;
            });
    }

    /**
     * Get a filter by ID
     * @param {String}   filterId - The filter ID
     * @param {Promise}             - Resolve on success
     */
    function getById(filterId) {
        return Filter
            .findById(filterId)
            .exec();
    }

    /**
     * List filter using cursor
     * @param {Promise} - Resolve on success with a cursor object
     */
    function listByCursor() {
        return Filter.find().cursor();
    }

    /**
    * Remove filter by ID
    * @param {String}   filterId - The software ID
    * @param {Promise}             - Resolve on success
    */
    function removeById(filterId) {
        return Filter
            .findByIdAndRemove(filterId)
            .then(deletedFilter => {
                if (deletedFilter) {
                    filterDeletedTopic.publish(deletedFilter);
                }

                return deletedFilter;
            });
    }
};
