const filesStorage = require('./files.storage');

function downloadRequest(Module = {}) {
  const { files } = Module;

  const ret = async (attributes = {}) => {
    const { bucketName, objectName } = attributes;
    const file = await files.storage.downloadRequest({ bucketName, objectName });

    return file;
  };

  return ret;
}

function listObject(Module = {}) {
  const { files } = Module;

  const ret = async bucketName => {
    const file = await files.storage.listObject(bucketName);

    return file;
  };

  return ret;
}

function uploadRequest(Module = {}) {
  const { files } = Module;

  const ret = async (attributes = {}) => {
    const { bucketName, objectName } = attributes;
    const file = await files.storage.uploadRequest({ bucketName, objectName });

    return file;
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    files: { storage: filesStorage.attach(attachment) },
  };

  const functions = [downloadRequest, listObject, uploadRequest];
  const ret = {};

  functions.forEach(fn => {
    ret[fn.name] = fn(Module);
  });

  return ret;
}

module.exports = {
  attach,
};
