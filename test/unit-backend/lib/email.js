const { expect } = require('chai');
const sinon = require('sinon');
const mockery = require('mockery');
const q = require('q');

describe('The email module', function() {
  let moduleHelpers, EMAIL_NOTIFICATIONS, NOTIFICATIONS_TYPE;
  let emailModule, userModule, i18nModule, esnConfigModule, getMultipleSpy, sendHTML;
  let ticket, config, user;

  beforeEach(function() {
    moduleHelpers = this.moduleHelpers;
    EMAIL_NOTIFICATIONS = require(moduleHelpers.backendPath + '/lib/constants').EMAIL_NOTIFICATIONS;
    NOTIFICATIONS_TYPE = require(moduleHelpers.backendPath + '/lib/constants').NOTIFICATIONS_TYPE;

    sendHTML = sinon.stub().returns(Promise.resolve());
    emailModule = {
      getMailer: sinon.spy(() => ({
        sendHTML
      }))
    };

    i18nModule = {
      __n: sinon.spy(text => text)
    };

    config = [
      {
        value: 'http://localhost'
      },
      {
        value: {
          replyto: 'ossa-dev@linagora.com',
          noreply: 'noreply-dev@linagora.com',
          support: 'ossa-dev@linagora.com'
        }
      }
    ];

    getMultipleSpy = sinon.spy(function() {
      return q.when(config);
    });

    esnConfigModule = {
      EsnConfig: function() {
        return {
          getMultiple: getMultipleSpy
        };
      }
    };

    user = {_id: 1234};
    userModule = {
      get: sinon.spy(function(id, callback) {
        callback(null, user);
      })
    };

    this.moduleHelpers.addDep('email', emailModule);
    this.moduleHelpers.addDep('coreUser', userModule);
    this.moduleHelpers.addDep('esn-config', esnConfigModule);

    mockery.registerMock('../i18n', () => i18nModule);

    ticket = {
      author: {
        id: 1234
      }
    };
  });

  const getModule = () => require(moduleHelpers.backendPath + '/lib/email')(moduleHelpers.dependencies);

  describe('The send function', function() {
    it('should retrieve configuration', function(done) {
      getModule()
        .send({
          emailType: EMAIL_NOTIFICATIONS.TYPES.CREATED,
          ticket
        })
        .then(() => {
          expect(getMultipleSpy).to.have.been.calledWith(['frontendUrl', 'mail', 'ssp', 'limesurvey']);
          done();
        })
        .catch(done);
    });

    it('should retrieve esn user', function(done) {
      getModule()
        .send({
          emailType: EMAIL_NOTIFICATIONS.TYPES.CREATED,
          notificationType: NOTIFICATIONS_TYPE.ALL_ATTENDEES,
          ticket
        })
        .then(() => {
          expect(userModule.get).to.have.been.called;
          done();
        })
        .catch(done);
    });

    it('should retrieve user mailer', function(done) {
      getModule()
        .send({
          emailType: EMAIL_NOTIFICATIONS.TYPES.CREATED,
          notificationType: NOTIFICATIONS_TYPE.ALL_ATTENDEES,
          ticket
        })
        .then(() => {
          expect(emailModule.getMailer).to.have.been.calledWith;
          done();
        })
        .catch(done);
    });

    it('should send html email', function(done) {
      getModule()
        .send({
          emailType: EMAIL_NOTIFICATIONS.TYPES.CREATED,
          ticket
        })
        .then(() => {
          expect(sendHTML).to.have.been.calledWith;
          done();
        })
        .catch(done);
    });
  });
});

