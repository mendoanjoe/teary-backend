const router = require('koa-router')();

let presenter = require('./files.presenter');

function attach(attachment = {}) {
  presenter = presenter.attach(attachment);

  router.prefix('/files');

  router.get('/:bucketName', presenter.GetObjectList);
  router.post('/download/request', presenter.GetDownloadRequest);
  router.post('/upload/request', presenter.GetUploadRequest);

  return router;
}

module.exports = {
  attach,
};
