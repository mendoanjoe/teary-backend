const path = require('path');
const winston = require('winston');

module.exports = env => {
  const pwd = path.resolve('./log');
  const logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.simple(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [new winston.transports.File({ filename: `${pwd}/postgres.${env}.log` })],
  });

  return logger;
};
