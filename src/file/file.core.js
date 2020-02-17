const storage = require('./file.storage');

function downloadRequest(Module = {}) {
  const { Storage } = Module;

  const ret = async (attributes = {}) => {
    const { bucketName, objectName } = attributes;

    const res = await Storage.downloadRequest({ bucketName, objectName });

    return res;
  };

  return ret;
}

function listObject(Module = {}) {
  const { Storage } = Module;

  const ret = async bucketName => {
    const res = await Storage.listObject(bucketName);

    return res;
  };

  return ret;
}

function uploadRequest(Module = {}) {
  const { Storage } = Module;

  const ret = async (attributes = {}) => {
    const { bucketName, objectName } = attributes;

    const res = await Storage.uploadRequest({ bucketName, objectName });

    return res;
  };

  return ret;
}

function attach(attachment = {}) {
  const External = {};

  const Storage = storage.attach(attachment);

  const functions = [downloadRequest, listObject, uploadRequest];
  const ret = {};

  functions.forEach(fn => {
    ret[fn.name] = fn({ External, Storage });
  });

  return ret;
}

module.exports = {
  attach,
};
