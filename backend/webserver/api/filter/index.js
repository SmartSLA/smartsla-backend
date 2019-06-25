'use strict';

module.exports = function (dependencies, lib, router) {
    const { checkIdInParams } = dependencies('helperMw');
    const authorizationMW = dependencies('authorizationMW');
    const controller = require('./controller')(dependencies, lib);
    const {
        canCreateFilter,
        canListFilter,
        canUpdateFilter
    } = require('./middleware')(dependencies, lib);

    router.get('/filters',
        authorizationMW.requiresAPILogin,
        canListFilter,
        controller.list
    );

    router.get('/filters/:id',
        authorizationMW.requiresAPILogin,
        canListFilter,
        controller.get
    );

    router.post('/filters',
        authorizationMW.requiresAPILogin,
        canCreateFilter,
        controller.create
    );

    router.put('/filters/:id',
        authorizationMW.requiresAPILogin,
        canUpdateFilter,
        checkIdInParams('id', 'filter'),
        canUpdateFilter,
        controller.update
    );
};
