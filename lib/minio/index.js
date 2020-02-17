const Minio = require('minio');

const bucket = require('./bucket');
const logger = require('./logger');
const object = require('./object');
const presigned = require('./presigned');

function init(env) {
  const {
    NODE_ENV,

    MINIO_ENDPOINT,
    MINIO_PORT,
    MINIO_SSL,
    MINIO_ACESS_KEY,
    MINIO_SECRET_KEY,
  } = env;

  const minio = new Minio.Client({
    endPoint: MINIO_ENDPOINT,
    port: parseInt(MINIO_PORT, 10),
    useSSL: MINIO_SSL === 'true',
    accessKey: MINIO_ACESS_KEY,
    secretKey: MINIO_SECRET_KEY,
  });

  const attachment = { minio, logger: logger(NODE_ENV) };

  return {
    minio,

    bucket: bucket.attach(attachment),
    object: object.attach(attachment),
    presigned: presigned.attach(attachment),
  };
}

module.exports = {
  init,
};
