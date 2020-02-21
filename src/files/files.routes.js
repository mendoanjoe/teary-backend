const router = require('koa-router')();

let presenter = require('./files.presenter');

function attach(attachment = {}) {
  presenter = presenter.attach(attachment);

  router.prefix('/files');

  router.get('/:bucketName', presenter.ListObject);
  router.post('/download/request', presenter.DownloadRequest);
  router.post('/upload/request', presenter.UploadRequest);

  return router;
}

module.exports = {
  attach,
};
