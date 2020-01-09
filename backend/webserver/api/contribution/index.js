'use strict';

module.exports = function(dependencies, lib, router) {
    const { checkIdInParams } = dependencies('helperMw');
    const authorizationMW = dependencies('authorizationMW');
    const controller = require('./controller')(dependencies, lib);

    const {
        canCreateContribution,
        canUpdateContribution,
        canRemoveContribution,
        validateContributionCreatePayload,
        validateContributionUpdatePayload
    } = require('./middleware')(dependencies, lib);

    router.get('/contributions',
        authorizationMW.requiresAPILogin,
        controller.list
    );

    router.get('/contributions/:id',
        authorizationMW.requiresAPILogin,
        checkIdInParams('id', 'contribution'),
        controller.get
    );

    router.post('/contributions',
        authorizationMW.requiresAPILogin,
        canCreateContribution,
        validateContributionCreatePayload,
        controller.create
    );

    router.post('/contributions/:id',
        authorizationMW.requiresAPILogin,
        canUpdateContribution,
        validateContributionUpdatePayload,
        controller.update
    );

    router.delete('/contributions/:id',
        authorizationMW.requiresAPILogin,
        canRemoveContribution,
        controller.remove
    );

};
