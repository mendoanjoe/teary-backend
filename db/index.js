const postgres = require('./postgres');

function init(env) {
  return {
    postgres: postgres.init(env),
  };
}

module.exports = {
  init,
};
