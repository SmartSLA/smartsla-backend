'use strict';

module.exports = {
  administrator: {
    can: {
      ticket: ['create', 'read', 'update', 'edit', 'list']
    }
  },
  supporter: {
    can: {
      ticket: [
        'read',
        {
          name: 'update',
          when: options => {
            const supportTechnicianIds = options.ticket.supportTechnicians.map(supportTechnician => String(supportTechnician._id));

            return supportTechnicianIds.indexOf(String(options.user._id)) !== -1 ||
                   String(options.ticket.supportManager._id) === String(options.user._id) ||
                   String(options.ticket.contract.defaultSupportManager) === String(options.user._id);
          }
        },
        {
          name: 'edit',
          when: options => String(options.ticket.contract.defaultSupportManager) === String(options.user._id)
        },
        'list'
      ]
    }
  },
  user: {
    can: {
      ticket: [
        {
          name: 'read',
          when: options => {
            const requesterId = options.ticket.requester && options.ticket.requester._id ? options.ticket.requester._id : options.ticket.requester;

            return String(requesterId) === String(options.user._id);
          }
        },
        'list'
      ]
    }
  }
};
