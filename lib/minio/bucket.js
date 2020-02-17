function create(attachment = {}) {
  const { logger, minio } = attachment;

  const ret = async (attributes = {}) => {
    const { name, server } = attributes;

    const promise = new Promise((resolve, reject) => {
      minio.makeBucket(name, server, err => {
        if (err) {
          logger.error(err);

          reject(err);
          return;
        }

        resolve(true);
      });
    });

    return promise;
  };

  return ret;
}

function isExists(attachment = {}) {
  const { logger, minio } = attachment;

  const ret = async name => {
    const promise = new Promise((resolve, reject) => {
      minio.bucketExists(name, (err, exists) => {
        if (err) {
          logger.error(err);

          reject(err);
          return;
        }

        resolve(exists);
      });
    });

    return promise;
  };

  return ret;
}

function list(attachment = {}) {
  const { logger, minio } = attachment;

  const ret = async () => {
    const promise = new Promise((resolve, reject) => {
      minio.listBuckets((err, buckets) => {
        if (err) {
          logger.error(err);

          reject(err);
          return;
        }

        resolve(buckets);
      });
    });

    return promise;
  };

  return ret;
}

function objects(attachment = {}) {
  const { minio, logger } = attachment;

  const ret = async (attributes = {}) => {
    const { bucketName } = attributes;
    const prefix = attributes.prefix || '';
    const recursive = attributes.recursive === true;

    const promise = new Promise((resolve, reject) => {
      const stream = minio.listObjects(bucketName, prefix, recursive);
      const objectList = [];

      stream.on('data', obj => objectList.push(obj));
      stream.on('error', err => {
        logger.error(err);

        reject(err);
      });
      stream.on('end', () => resolve(objectList));
    });

    return promise;
  };

  return ret;
}

function remove(attachment = {}) {
  const { logger, minio } = attachment;

  const ret = async name => {
    const promise = new Promise((resolve, reject) => {
      minio.removeBucket(name, err => {
        if (err) {
          logger.error(err);

          reject(err);
          return;
        }

        resolve(true);
      });
    });

    return promise;
  };

  return ret;
}

function attach(attachment = {}) {
  const functions = [create, isExists, list, objects, remove];
  const ret = {};

  functions.forEach(fn => {
    ret[fn.name] = fn(attachment);
  });

  return ret;
}

module.exports = {
  attach,
};
