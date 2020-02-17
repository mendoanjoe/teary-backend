const axios = require('axios');

const winston = require('./logger');
const templates = require('./templates');

function sendgrid(credentials = {}, logger) {
  const { apiKey } = credentials;

  const baseURL = `https://api.sendgrid.com/v3/mail/send`;

  const send = (attributes = {}) => {
    const { from, subject, text, to } = attributes;

    axios
      .post(
        baseURL,
        {
          personalizations: [{ to: [{ email: to }], subject }],
          content: [
            {
              type: 'text/html',
              value: text,
            },
          ],
          from: { email: from },
          reply_to: { email: from },
        },
        {
          headers: {
            'content-yype': 'application/json',
            authorization: `Bearer ${apiKey}`,
          },
        }
      )
      .then(() => {
        logger.info(`Request to "${to}" granted`);
      })
      .catch(res => {
        const err = res.response.statusText;
        logger.error(`Request to "${to}" declined. Reason: ${err}.`);
      });
  };

  return {
    logger,
    send,
  };
}

function init(env) {
  const apiKey = env.SENDGRID_API_KEY;

  const mailer = sendgrid({ apiKey }, winston(env.NODE_ENV));

  return {
    mailer,

    templates: templates.attach(mailer),
  };
}

module.exports = {
  init,
};
