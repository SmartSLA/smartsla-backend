module.exports = dependencies => {
  const emailModule = dependencies('email');
  const userModule = dependencies('coreUser');
  const logger = dependencies('logger');
  const { EMAIL_NOTIFICATIONS } = require('../constants');
  const i18n = require('../i18n')(dependencies);

  return {
    send
  };

  function formatMessage(type, ticket, event) {
    switch (type) {
      case EMAIL_NOTIFICATIONS.TYPES.CREATED: {
        const subject = i18n.__('#{{id}} {{title}}: issue #{{id}} has been created',
          { id: ticket._id, title: ticket.title });

        return {
          subject: subject,
          text: subject
        };
      }
      case EMAIL_NOTIFICATIONS.TYPES.UPDATED: {
        if (event.status) {
          const translatedStatus = i18n.__(event.status);
          const subject = i18n.__('#{{id}} {{title}}: issue #{{id}} has been changed to {{status}}',
            { id: ticket._id, title: ticket.title, status: translatedStatus });

          return {
            subject: subject,
            text: subject
          };
        }

        if (event.target) {
          const subject = i18n.__('#{{id}} {{title}}: issue #{{id}} has been assigned to {{assignee}}',
            { id: ticket._id, title: ticket.title, assignee: ticket.assignedTo.name });

          return {
            subject: subject,
            text: subject
          };
        }

        if (event.comment) {
          const subject = i18n.__('#{{id}} {{title}}: issue #{{id}} has been commented by {{commenter}}',
            { id: ticket._id, title: ticket.title, commenter: event.comment.author.name });

          return {
            subject: subject,
            text: subject
          };
        }
      }
    }
  }

  function getRecipients(ticket) {
    const to = [];
    const cc = [];

    ticket.author && ticket.author.email && to.push(ticket.author.email);

    if (ticket.responsible && ticket.responsible.email) {
      to.push(ticket.responsible.email);
    } else {
      to.push(EMAIL_NOTIFICATIONS.DEFAULT_RESPONSIBLE_EMAIL);
    }

    cc.concat(ticket.participants);

    return { to: to, cc: cc };
  }

  function send(type, ticket) {
    userModule.get(ticket.author.id, function(err, user) {
      if (!err && user) {
        const message = formatMessage(type, ticket);

        if (!message) {
          return;
        }

        const recipents = getRecipients(ticket);

        message.to = recipents.to;
        message.cc = recipents.cc;
        message.from = EMAIL_NOTIFICATIONS.DEFAULT_FROM;

        emailModule.getMailer(user).send(message, logError);
      }

      return logError(err);
    });
  }

  function logError(err) {
    if (err) {
      logger.error('Unable to send notification email.', err);
    }
  }
};
