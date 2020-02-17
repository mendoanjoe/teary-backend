const Joi = require('@hapi/joi');

exports.registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
  object_name: Joi.string(),
});

exports.loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string().required(),
});
