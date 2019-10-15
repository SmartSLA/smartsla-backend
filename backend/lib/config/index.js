const config = {
  rights: {
    padmin: 'rw',
    admin: 'rw'
  },
  configurations: {
    frontendUrl: 'http://localhost:8080'
  }
};

module.exports = dependencies => {
  const esnConfig = dependencies('esn-config');

  return {
    register
  };

  function register() {
    esnConfig.registry.register('linagora.esn.ticketing', config);
  }
};
