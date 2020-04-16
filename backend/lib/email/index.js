module.exports = dependencies => {
  const emailModule = dependencies('email');
  const userModule = dependencies('coreUser');
  const EsnConfig = dependencies('esn-config').EsnConfig;

  const logger = dependencies('logger');
  const { EMAIL_NOTIFICATIONS } = require('../constants');
  const i18n = require('../i18n')(dependencies);
  const path = require('path');
  const TEMPLATE_PATH = path.resolve(__dirname, '../../templates/email');

  return {
    send
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

  function getRecipients(ticket, defaultResponsibleEmail) {
    const to = [];
    const cc = ticket.participants && [...ticket.participants];

    ticket.author && ticket.author.email && to.push(ticket.author.email);
    ticket.assignedTo && ticket.assignedTo.email && to.push(ticket.assignedTo.email);

    if (ticket.responsible && ticket.responsible.email) {
      to.push(ticket.responsible.email);
    } else {
      to.push(defaultResponsibleEmail || EMAIL_NOTIFICATIONS.DEFAULT_RESPONSIBLE_EMAIL);
    }

    return { to: to, cc: cc };
  }

  function getTemplateContent(ticket, frontendUrl, contractName) {
    const latestEvent = ticket.events.slice(-1).pop() || {};

    const ticketUrl = getTicketUrl(ticket, frontendUrl);

    return {ticket, latestEvent, ticketUrl, frontendUrl, contractName};
  }

  function getConfig() {
    return new EsnConfig('smartsla-backend')
      .getMultiple(['frontendUrl', 'mail'])
      .spread((frontendUrl, mail) => ({
        frontendUrl: frontendUrl && frontendUrl.value,
        mail: mail && mail.value
      }));
  }

  function send(emailType, ticket, contractName) {
    return getConfig()
      .then(({ frontendUrl, mail }) => {
        userModule.get(ticket.author.id, (err, user) => {
          if (err || !user) {
            return logError(err || `User ${ticket.author.id} not found`);
          }
          const content = getTemplateContent(ticket, frontendUrl, contractName);
          const recipients = getRecipients(ticket, mail.support);

          const message = {
            subject: i18n.__(emailType.subject, content),
            to: recipients.to,
            cc: recipients.cc,
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

  function logError(err) {
    if (err) {
      logger.error('Unable to send notification email', err);
    }
  }
};
