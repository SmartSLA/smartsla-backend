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
    ssp: {
      value: {
        sspUrl: 'https://ssp.08000linux.com/',
        isSspEnabled: true
      }
    },
    limesurvey: {
      value: {
        apiUrl: 'http://limesurvey.localhost:8080/admin/remotecontrol/',
        surveyId: 158386,
        username: 'username',
        password: 'password'
      }
    },
    lininfosec: {
      value: {
        apiUrl: 'http://lininfosec.localhost:9999',
        lininfosec_auth_token: 'LinagoraR7',
        author: {
          id: '5f3a805b7aa11a5db50a39c2',
          name: 'Amy WOLSH',
          email: 'amy.wolsh@open-paas.org',
          type: 'beneficiary',
          phone: ''
        }
      }
    },
    features: {
      rights: {
        padmin: 'rw',
        admin: 'rw',
        user: 'r'
      },
      value: {
        isLimesurveyEnabled: false,
        isDashboardEnabled: false,
        isLinInfosecEnabled: false
      }
    },
    language: {
      rights: {
        user: 'rw'
      },
      value: {
        defaultLanguage: 'en'
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
