function plain(mailer) {
  const send = async (attributes = {}) => {
    const { from, subject, text, to } = attributes;
    const data = { from, subject, text, to };

    mailer.send(data);
  };

  return {
    send,
  };
}

module.exports = plain;
