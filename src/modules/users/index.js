const core = require('./users.core');
const routes = require('./users.routes');
const storage = require('./users.storage');
const validation = require('./users.validation');

module.exports = {
  core,
  routes,
  storage,
  validation,
};
