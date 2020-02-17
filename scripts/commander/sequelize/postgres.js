const { execSync } = require('child_process');
const path = require('path');

function exec(args) {
  const pwd = path.resolve('./db/postgres');

  if (args.length === 0) {
    execSync(`npx sequelize`, { stdio: [0, 1, 2] });
  } else {
    execSync(`npx sequelize --options-path ${pwd}/.sequelizerc ${args.join(' ')}`, {
      stdio: [0, 1, 2],
    });
  }
}

module.exports = {
  exec,
};
