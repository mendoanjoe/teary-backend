const router = require('koa-router')();

let presenter = require('./file.presenter');

function attach(attachment = {}) {
  presenter = presenter.attach(attachment);

  router.prefix('/file');

  router.get('/:bucketName', presenter.ListObject);
  router.post('/download/request', presenter.DownloadRequest);
  router.post('/upload/request', presenter.UploadRequest);

  return router;
}

module.exports = {
  attach,
};
