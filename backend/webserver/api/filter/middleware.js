'use strict';

const composableMw = require('composable-middleware');

module.exports = (dependencies) => {
    const { send400Error } = require('../utils')(dependencies);

    return {
        validateFilterCreatePayload,
        validateFilterUpdatePayload
    };

    function validateFilterCreatePayload(req, res, next) {
        const middlewares = [
            validateBasicInfo
        ];

        return composableMw(...middlewares)(req, res, next);
    }

    function validateFilterUpdatePayload(req, res, next) {
        const middlewares = [
            validateBasicInfo
        ];

        return composableMw(...middlewares)(req, res, next);
    }

    function validateBasicInfo(req, res, next) {
        const { user } = req.body;
        const { items } = req.body;

        if (!user) {
            return send400Error('user is required', res);
        }
        if (!items.length) {
            return send400Error('Filter is empty', res);
        }

        next();
    }
};
