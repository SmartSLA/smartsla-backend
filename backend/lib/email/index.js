module.exports = dependencies => {
  const emailModule = dependencies('email');
  const userModule = dependencies('coreUser');
  const EsnConfig = dependencies('esn-config').EsnConfig;

  const logger = dependencies('logger');
  const { EMAIL_NOTIFICATIONS, NOTIFICATIONS_TYPE, USER_TYPE } = require('../constants');
  const moment = require('moment-timezone');
  const i18n = require('../i18n')(dependencies);
  const path = require('path');
  const TEMPLATE_PATH = path.resolve(__dirname, '../../templates/email');

  i18n.setLocale('fr'); //FIXME Need to be chosen by contract as prefered Locale
  moment.locale(i18n.locale);

  return {
    send,
    sendSspMail
  };

  function getTicketUrl(ticket, frontendUrl) {
    let ticketUrl = '';

    try {
      ticketUrl = new URL(`requests/${ticket._id}`, frontendUrl).toString();
    } catch (e) {
      logger.warn(`Invalid ticket url, please check that smartsla-backend.frontendUrl configuration is set with a valid url (current url: ${frontendUrl})`, e);
    }

    return ticketUrl;
  }

  function getExpertRecipients(ticket, defaultResponsibleEmail) {
    const to = [];

    ticket.author && ticket.author.email && ticket.author.type === USER_TYPE.EXPERT && to.push(ticket.author.email);
    ticket.assignedTo && ticket.assignedTo.email && ticket.assignedTo.type === USER_TYPE.EXPERT && to.push(ticket.assignedTo.email);

    if (ticket.responsible && ticket.responsible.email) {
      if (!to.includes(ticket.responsible.email)) to.push(ticket.responsible.email);
    } else {
      to.push(defaultResponsibleEmail || EMAIL_NOTIFICATIONS.DEFAULT_RESPONSIBLE_EMAIL);
    }

    return { to: to};
  }

  function getNonExpertRecipients(ticket) {
    const to = [];
    const cc = ticket.participants && [...ticket.participants];

    ticket.author && ticket.author.email && ticket.author.type !== USER_TYPE.EXPERT && to.push(ticket.author.email);
    ticket.assignedTo && ticket.assignedTo.email && ticket.assignedTo.type !== USER_TYPE.EXPERT && to.push(ticket.assignedTo.email);

    return { to: to, cc: cc };
  }

  function getParticipantsRecipients(ticket) {
    const to = ticket.participants && [...ticket.participants];
    const cc = [];

    return { to: to, cc: cc };
  }

  function getTemplateContent(ticket, frontendUrl, contractName, limesurvey, backendUrl, notificationType) {
    const latestEvent = ticket.events.slice(-1).pop() || {};

    const ticketUrl = getTicketUrl(ticket, frontendUrl);

    const limesurveyUrl = getLimesurveyUrl(ticket, limesurvey && limesurvey.limesurveyUrl);

    return {ticket, latestEvent, ticketUrl, frontendUrl, contractName, limesurveyUrl, backendUrl, notificationType, moment};
  }

  function getLimesurveyUrl(ticket, limesurveyUrl) {
    let limesurveyURL;
    const { id: survey_id, token } = ticket.survey;

    if (survey_id && token) {
      try {
        limesurveyURL = new URL(`${limesurveyUrl}${survey_id}/lang/fr/newtest/Y?token=${token}`, `${limesurveyUrl}${survey_id}`).toString();
      } catch (e) {
        logger.warn(`Invalid limesurvey url, please check that smartsla-backend.limesurvey configuration is set with a valid url (current url: ${limesurveyUrl})`, e);
      }
    }

    return limesurveyURL;
  }

  function getConfig() {
    return new EsnConfig('smartsla-backend')
      .getMultiple(['frontendUrl', 'mail', 'ssp', 'limesurvey'])
      .spread((frontendUrl, mail, ssp, limesurvey) => ({
        frontendUrl: frontendUrl && frontendUrl.value,
        mail: mail && mail.value,
        ssp: ssp && ssp.value,
        limesurvey: limesurvey && limesurvey.value
      }));
  }

  function send({emailType, notificationType, ticket, contract = {}, addReferents = false}) {
    const { name: contractName, mailingList } = contract;

    return getConfig()
      .then(conf => {
        const { frontendUrl, mail, limesurvey } = conf;

        userModule.get(ticket.author.id, async (err, user) => {
          if (err || !user) {
            return logError(err || `User ${ticket.author.id} not found`);
          }

          const backendUrl = `http://${process.env.WEB_HOST || 'localhost'}:${process.env.WEB_PORT || '8080'}`;

          const content = getTemplateContent(ticket, frontendUrl, contractName, limesurvey, backendUrl, notificationType);
          let recipients = getExpertRecipients(ticket, mail.support);

          if (notificationType === NOTIFICATIONS_TYPE.ALL_ATTENDEES) {
            const externalRecipients = getNonExpertRecipients(ticket);
            const concatRecipients = recipients.to.concat(externalRecipients.to);

            recipients = {to: concatRecipients, cc: externalRecipients.cc};
          }

          if (notificationType === NOTIFICATIONS_TYPE.MENTIONED_ATTENDEES) {
            recipients = getParticipantsRecipients(ticket);
          }

          if (addReferents && ticket.software && !!ticket.software.technicalReferent.length) {
            const technicalReferentRecipients = ticket.software.technicalReferent.map(({email}) => email);

            recipients.cc = [...recipients.cc, ...technicalReferentRecipients];
          }

          const message = {
            subject: i18n.__(emailType.subject, content),
            to: recipients.to,
            cc: recipients.cc,
            bcc: mailingList,
            from: mail.noreply,
            replyTo: mail.replyto
          };

          return emailModule.getMailer(user).sendHTML(
            message,
            { name: emailType.template, path: TEMPLATE_PATH },
            { content, translate: (...args) => i18n.__n(...args) },
            logError
          );
        });
      })
      .catch(logError);
  }

  function sendSspMail(emailType, user) {
    return getConfig()
    .then(({ ssp, mail, frontendUrl }) => {
        const recipient = user.preferredEmail;
        const { subject, template } = emailType;

        const content = {
          sspUrl: ssp.sspUrl,
          sspUrlReset: ssp.sspUrlReset,
          contactSupport: mail.support,
          frontendUrl
        };

        const message = {
          subject: i18n.__(subject, content),
          to: recipient,
          from: mail.noreply,
          replyTo: mail.replyto
        };

        return emailModule.getMailer(user).sendHTML(
          message,
          { name: template, path: TEMPLATE_PATH },
          { content, translate: (...args) => i18n.__n(...args) },
          logError
        );
    })
    .catch(logError);
  }

  function logError(err) {
    if (err) {
      logger.error('Unable to send notification email', err);
    }
  }
};
