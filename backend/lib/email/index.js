module.exports = dependencies => {
  const emailModule = dependencies('email');
  const userModule = dependencies('coreUser');
  const logger = dependencies('logger');
  const { EMAIL_NOTIFICATIONS } = require('../constants');

  return {
    send
  };

  function formatMessage(type, data) {
    switch (type) {
      case EMAIL_NOTIFICATIONS.TYPES.CREATED:
        return {
          subject: `#${data._id} ${data.title}: La demande ${data._id} vient d‘être créée`,
          text: `#${data._id} ${data.title}: La demande ${data._id} vient d‘être créée`
        };
      case EMAIL_NOTIFICATIONS.TYPES.UPDATED: {
        const comment = data.comments[data.comments.length - 1];
        const action = getChange(data.logs, 'action');
        const assignedTo = getChange(data.logs, 'assignedTo');

        if (action) {
          return {
            subject: `#${data._id} ${data.title}: Le statut de la demande ${data._id} est passé à  ${action}`,
            text: `#${data._id} ${data.title}: Le statut de la demande ${data._id} est passé à  ${action}`
          };
        }

        if (assignedTo) {
          return {
            subject: `#${data._id} ${data.title}: La demande ${data._id} a été assignée à ${data.assignedTo.name}`,
            text: `#${data._id} ${data.title}: La demande ${data._id} a été assignée à ${data.assignedTo.name}`
          };
        }

        if (comment) {
          return {
            subject: `#${data._id} ${data.title}: La demande ${data._id} vient d‘être commentée par ${comment.author.name}`,
            text: `#${data._id} ${data.title}: La demande ${data._id} vient d‘être commentée par ${comment.author.name}`
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
