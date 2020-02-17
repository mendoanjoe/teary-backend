function remove(attachment = {}) {
  const { logger, minio } = attachment;

  const ret = async (attributes = {}) => {
    const { bucketName, objectName } = attributes;

    const promise = new Promise((resolve, reject) => {
      minio.removeObject(bucketName, objectName, err => {
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

function removeSome(attachment = {}) {
  const { logger, minio } = attachment;

  const ret = async (attributes = {}) => {
    const { bucketName, objectNameList } = attributes;

    const promise = new Promise((resolve, reject) => {
      minio.removeObjects(bucketName, objectNameList, err => {
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

function stat(attachment = {}) {
  const { logger, minio } = attachment;

  const ret = async (attributes = {}) => {
    const { bucketName, objectName } = attributes;

    const promise = new Promise((resolve, reject) => {
      minio.statObject(bucketName, objectName, (err, res) => {
        if (err) {
          logger.error(err);

          reject(err);
          return;
        }

        resolve(res);
      });
    });

    return promise;
  };

  return ret;
}

function attach(attachment = {}) {
  const functions = [remove, removeSome, stat];
  const ret = {};

  functions.forEach(fn => {
    ret[fn.name] = fn(attachment);
  });

  return ret;
}

module.exports = {
  attach,
};
