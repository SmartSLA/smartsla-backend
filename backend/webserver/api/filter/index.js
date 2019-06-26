'use strict';

module.exports = function(dependencies, lib, router) {
    const { checkIdInParams } = dependencies('helperMw');
    const authorizationMW = dependencies('authorizationMW');
    const controller = require('./controller')(dependencies, lib);
    const {
        validateFilterCreatePayload,
        validateFilterUpdatePayload
    } = require('./middleware')(dependencies, lib);

    router.get('/filters',
        authorizationMW.requiresAPILogin,
        controller.list
    );

    router.get('/filters/:id',
        authorizationMW.requiresAPILogin,
        controller.get
    );

    router.post('/filters',
        authorizationMW.requiresAPILogin,
        validateFilterCreatePayload,
        controller.create
    );

    router.put('/filters/:id',
        authorizationMW.requiresAPILogin,
        checkIdInParams('id', 'filter'),
        validateFilterUpdatePayload,
        controller.update
    );
};
