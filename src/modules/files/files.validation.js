const Joi = require('@hapi/joi');

exports.getDownloadRequestSchema = Joi.object({
  bucketName: Joi.string()
    .min(1)
    .required(),
  objectName: Joi.string()
    .min(1)
    .required(),
});

exports.getObjectListSchema = Joi.object({
  bucketName: Joi.string()
    .min(1)
    .required(),
});

exports.getUploadRequestSchema = this.getDownloadRequestSchema;
