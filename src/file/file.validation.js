const Joi = require('@hapi/joi');

exports.downloadRequestSchema = Joi.object({
  bucketName: Joi.string()
    .min(1)
    .required(),
  objectName: Joi.string()
    .min(1)
    .required(),
});

exports.listObjectSchema = Joi.object({
  bucketName: Joi.string()
    .min(1)
    .required(),
});

exports.uploadRequestSchema = this.downloadRequestSchema;
