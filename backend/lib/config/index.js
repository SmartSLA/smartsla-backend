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
    },
    limesurvey: {
      value: {
        apiUrl: 'http://limesurvey.localhost:8080/admin/remotecontrol/',
        surveyId: 158386,
        username: 'username',
        password: 'password'
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
    esnConfig.registry.register('smartsla-backend', config);
  }
};
