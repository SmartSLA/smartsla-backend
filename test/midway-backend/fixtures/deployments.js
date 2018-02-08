'use strict';

module.exports = {
  ticketingModule,
  ticketingUsers
};

function ticketingUsers() {
  return [
    {
      firstname: 'admin',
      lastname: 'admin',
      accounts: [{
        type: 'email',
        emails: ['admin@tic.org'],
        hosted: true
      }],
      main_phone: '3333',
      role: 'administrator',
      password: 'secret'
    },
    {
      firstname: 'supporter',
      lastname: 'supporter',
      accounts: [{
        type: 'email',
        emails: ['supporter@tic.org'],
        hosted: true
      }],
      main_phone: '4444',
      role: 'supporter',
      password: 'secret'
    },
    {
      firstname: 'user1',
      lastname: 'user1',
      accounts: [{
        type: 'email',
        emails: ['user1@tic.org'],
        hosted: true
      }],
      main_phone: '5555',
      password: 'secret'
    },
    {
      firstname: 'user2',
      lastname: 'user2',
      accounts: [{
        type: 'email',
        emails: ['user2@tic.org'],
        hosted: true
      }],
      main_phone: '6666',
      password: 'secret'
    }
  ];
}

function ticketingModule() {
  return {
    domain: {
      name: 'ticketing-domain',
      hostnames: [
        'localhost',
        '127.0.0.1'
      ],
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
