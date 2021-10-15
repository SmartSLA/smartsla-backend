module.exports = dependencies => {
  const emailModule = dependencies('email');
  const userModule = dependencies('coreUser');
  const EsnConfig = dependencies('esn-config').EsnConfig;

  const logger = dependencies('logger');
  const { EMAIL_NOTIFICATIONS, NOTIFICATIONS_TYPE, USER_TYPE } = require('../constants');
  const i18n = require('../i18n')(dependencies);
  const path = require('path');
  const TEMPLATE_PATH = path.resolve(__dirname, '../../templates/email');

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

  function getTemplateContent(ticket, frontendUrl, contractName) {
    const latestEvent = ticket.events.slice(-1).pop() || {};

    const ticketUrl = getTicketUrl(ticket, frontendUrl);

    return {ticket, latestEvent, ticketUrl, frontendUrl, contractName};
  }

  function getConfig() {
    return new EsnConfig('smartsla-backend')
      .getMultiple(['frontendUrl', 'mail', 'ssp'])
      .spread((frontendUrl, mail, ssp) => ({
        frontendUrl: frontendUrl && frontendUrl.value,
        mail: mail && mail.value,
        ssp: ssp && ssp.value
      }));
  }

  function send({emailType, notificationType, ticket, contract = {}}) {
    const { name: contractName, mailingList } = contract;

    return getConfig()
      .then(({ frontendUrl, mail }) => {
        userModule.get(ticket.author.id, (err, user) => {
          if (err || !user) {
            return logError(err || `User ${ticket.author.id} not found`);
          }

          const content = getTemplateContent(ticket, frontendUrl, contractName);
          let recipients = getExpertRecipients(ticket, mail.support);

          if (notificationType === NOTIFICATIONS_TYPE.ALL_ATTENDEES) {
            const externalRecipients = getNonExpertRecipients(ticket);
            const concatRecipients = recipients.to.concat(externalRecipients.to);

            recipients = {to: concatRecipients, cc: externalRecipients.cc};
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
