const plain = require('./plain');

function attach(mailer) {
  const ret = {};
  const templates = [plain];

  templates.forEach(template => {
    ret[template.name] = template(mailer);
  });

  return ret;
}

module.exports = {
  attach,
};
