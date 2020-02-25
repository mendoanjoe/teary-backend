const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(module.filename);
const config = require('./config');
const winston = require('./../../lib/logger');

function isValidFile(file) {
  return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
}

function init(env) {
  if (!env.NODE_ENV) {
    // eslint-disable-next-line no-console
    console.error('NODE_ENV is not defined');
    process.exit(1);
  }

  const db = config[env.NODE_ENV];
  const logger = winston(env);
  const sequelize = new Sequelize(db.database, db.username, db.password, db);
  const dbs = {};

  sequelize
    .authenticate()
    .then(() => logger.info(`Connected to "${env.POSTGRES_DATABASE}" database.`))
    .catch(exception => {
      logger.error(exception.original.message);

      // eslint-disable-next-line no-console
      console.error(`Unable to connect to the "${env.POSTGRES_DATABASE}" database.`);
      // eslint-disable-next-line no-console
      console.error();
      // eslint-disable-next-line no-console
      console.error(`Please see more on log/app.${env.NODE_ENV}.log.`);
      process.exit(1);
    });

  const pwd = path.resolve('./db/postgres');
  const modelsPath = `${pwd}/models`;
  
  fs.readdirSync(modelsPath)
    .filter(file => isValidFile(file))
    .forEach(file => {
      const model = sequelize.import(path.join(modelsPath, `/${file}`));
      dbs[model.name] = model;
    });

  // associate db
  // https://sequelize.org/master/manual/assocs.html
  Object.keys(dbs).forEach(modelName => {
    if (dbs[modelName].associate) {
      dbs[modelName].associate(dbs);
    }
  });
  
  return sequelize;
}

module.exports = {
  init,
};
