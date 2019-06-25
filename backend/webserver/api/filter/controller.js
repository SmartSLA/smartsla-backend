'use strict';

module.exports = function (dependencies, lib) {
    const { send404Error, send500Error } = require('../utils')(dependencies);

    return {
        create,
        get,
        list,
        update
    };

    /**
     * Create a filter
     *
     * @param {Request} req
     * @param {Response} res
     */
    function create(req, res) {
        return lib.filter.create(req.body)
            .then(createdFilter => res.status(201).json(createdFilter))
            .catch(err => send500Error('Failed to create filter', err, res));
    }

    /**
     * List filters
     *
     * @param {Request} req
     * @param {Response} res
     */
    function list(req, res) {
        let getFilter;
        let errorMessage;

        if (req.query.search) {
            const options = {
                limit: +req.query.limit,
                offset: +req.query.offset,
                search: req.query.search,
                excludedIds: req.query.excludedIds
            };

            errorMessage = 'Error while searching filter';
            getFilter = lib.filter.search(options);
        } else {
            const options = {
                limit: +req.query.limit,
                offset: +req.query.offset
            };

            errorMessage = 'Failed to list filter';
            getFilter = lib.filter.list(options)
                .then(filters => ({
                    total_count: filters.length,
                    list: filters
                }));
        }

        return getFilter
            .then(result => {
                res.header('X-ESN-Items-Count', result.total_count);
                res.status(200).json(result.list);
            })
            .catch(err => send500Error(errorMessage, err, res));
    }

    /**
     * Get a filter
     *
     * @param {Request} req
     * @param {Response} res
     */
    function get(req, res) {
        return lib.filter.getById(req.params.id)
            .then(filter => {
                filter = filter.toObject();

                return res.status(200).json(filter);

            })
            .catch(err => send500Error('Failed to get filter', err, res));
    }

    /**
     * Update a filter
     *
     * @param {Request} req
     * @param {Response} res
     */
    function update(req, res) {
        return lib.filter.updateById(req.params.id, req.body)
            .then(numberOfUpdatedDocs => {
                if (numberOfUpdatedDocs) {
                    return res.status(204).end();
                }

                return send404Error('filter not found', res);
            })
            .catch(err => send500Error('Failed to update filter', err, res));
    }
};
