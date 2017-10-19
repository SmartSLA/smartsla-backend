'use strict';

module.exports = {
  ticketingModule
};

function ticketingModule() {
  return {
    domain: {
      name: 'ticketing-domain',
      company_name: 'linagora'
    },
    users: [
      {
        password: 'secret',
        firstname: 'Domain ',
        lastname: 'Administrator',
        accounts: [{
          type: 'email',
          hosted: true,
          emails: ['itadmin@ticketing.net']
        }]
      },
      {
        password: 'secret',
        firstname: 'John',
        lastname: 'Doe',
        accounts: [{
          type: 'email',
          hosted: true,
          emails: ['jdoe@ticketing.net']
        }]
      },
      {
        password: 'secret',
        firstname: 'Foo',
        lastname: 'Bar',
        accounts: [{
          type: 'email',
          hosted: true,
          emails: ['foobar@ticketing.net']
        }]
      }
    ]
  };
}
