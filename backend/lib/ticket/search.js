const { ALL_CONTRACTS } = require('../constants');

module.exports = dependencies => {
    const mongoose = dependencies('db').mongo.mongoose;
    const Ticket = mongoose.model('Ticket');
    const contract = require('../contract')(dependencies);

    function search(req) {
        return buildQuery(req).then(result => ({
            size: result.length,
            list: result
        }));
    }

    function buildQuery(req) {
        const {query, user, ticketingUser} = req;
        let contractIdFilter;

        let findOptions = {
            $or: [
                {title: new RegExp(`${query.q}`, 'i')},
                {description: new RegExp(`${query.q}`, 'i')}
            ]
        };

        if (!isNaN(parseInt(query.q, 10))) {
            findOptions.$or = [...findOptions.$or, {_id: query.q}];
        }

        return contract.allowedContracts({ user, ticketingUser })
            .then(allowedContractIds => {

                if (allowedContractIds && allowedContractIds !== ALL_CONTRACTS) {
                    contractIdFilter = allowedContractIds.map(String);
                }

                if (query.contract) {
                    contractIdFilter = contractIdFilter ? [query.contract].filter(contract => contractIdFilter.includes(contract)) : [query.contract];
                }

                if (contractIdFilter) {
                    findOptions = {
                        ...findOptions,
                        contract: { $in: contractIdFilter.map(mongoose.Types.ObjectId) }
                    };
                }

                return Ticket.find(findOptions).exec();
            });
    }

    return search;
};
