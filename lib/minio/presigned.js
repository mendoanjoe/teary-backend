function downloadUrl(attachment = {}) {
  const { logger, minio } = attachment;

  const ret = async (attributes = {}) => {
    const { bucketName, objectName } = attributes;

    const promise = new Promise((resolve, reject) => {
      minio.presignedGetObject(bucketName, objectName, (err, url) => {
        if (err) {
          logger.error(err);

          reject(err);
          return;
        }

        resolve(url);
      });
    });

    return promise;
  };

  return ret;
}

function uploadUrl(attachment = {}) {
  const { logger, minio } = attachment;

  const ret = async (attributes = {}) => {
    const { bucketName, objectName } = attributes;

    const promise = new Promise((resolve, reject) => {
      minio.presignedPutObject(bucketName, objectName, (err, url) => {
        if (err) {
          logger.error(err);

          reject(err);
          return;
        }

        resolve(url);
      });
    });

    return promise;
  };

  return ret;
}

function attach(attachment = {}) {
  const functions = [downloadUrl, uploadUrl];
  const ret = {};

  functions.forEach(fn => {
    ret[fn.name] = fn(attachment);
  });

  return ret;
}

module.exports = {
  attach,
};
