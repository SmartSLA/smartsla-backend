const config = {
  rights: {
    padmin: 'rw',
    admin: 'rw'
  },
  configurations: {
    frontendUrl: 'http://localhost:8080',
    mail: {
      value: {
        replyto: 'ossa-dev@linagora.com',
        noreply: 'noreply-dev@linagora.com',
        support: 'ossa-dev@linagora.com'
      }
    }
  }
};

module.exports = dependencies => {
  const esnConfig = dependencies('esn-config');

  return {
    register
  };

  function register() {
    esnConfig.registry.register('ticketing08000linux.backend', config);
  }
};
