module.exports = dependencies => {
  const emailModule = dependencies('email');
  const userModule = dependencies('coreUser');
  const logger = dependencies('logger');
  const { EMAIL_NOTIFICATIONS } = require('../constants');
  const i18n = require('../i18n')(dependencies);

  return {
    send
  };

  function formatMessage(type, data) {
    switch (type) {
      case EMAIL_NOTIFICATIONS.TYPES.CREATED: {
        const subject = i18n.__('#{{id}} {{title}}: issue #{{id}} has been created',
          { id: data._id, title: data.title });

        return {
          subject: subject,
          text: subject
        };
      }
      case EMAIL_NOTIFICATIONS.TYPES.UPDATED: {
        const comment = data.comments[data.comments.length - 1];
        const action = getChange(data.logs, 'action');
        const assignedTo = getChange(data.logs, 'assignedTo');

        if (action) {
          const translatedAction = i18n.__(action);
          const subject = i18n.__('#{{id}} {{title}}: issue #{{id}} has been changed to {{status}}',
            { id: data._id, title: data.title, status: translatedAction });

          return {
            subject: subject,
            text: subject
          };
        }

        if (assignedTo) {
          const subject = i18n.__('#{{id}} {{title}}: issue #{{id}} has been assigned to {{assignee}}',
            { id: data._id, title: data.title, assignee: data.assignedTo.name });

          return {
            subject: subject,
            text: subject
          };
        }

        if (comment) {
          const subject = i18n.__('#{{id}} {{title}}: issue #{{id}} has been commented by {{commenter}}',
            { id: data._id, title: data.title, commenter: comment.author.name });

          return {
            subject: subject,
            text: subject
          };
        }
      }
    }

    function getChange(arr, field) {
      let previousValue;
      const arrayLength = arr.length;

      if (arrayLength > 1) {
        previousValue = arr[arrayLength - 2][field];
      }

      const latestValue = arr[arrayLength - 1][field];

      if (previousValue !== latestValue) {
        return latestValue;
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
