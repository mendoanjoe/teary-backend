const Joi = require('@hapi/joi');

exports.createUserSchema = Joi.object({
  nim: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
  bucket_name: Joi.string(),
});

exports.updateUserSchema = Joi.object({
  role_id: Joi.string().uuid(),
  nim: Joi.string(),
  email: Joi.string(),
  name: Joi.string(),
  password: Joi.string(),
  bucket_name: Joi.string(),
});

exports.changePasswordUserSchema = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().required(),
});

exports.needUserId = Joi.object({
  userId: Joi.string()
    .uuid()
    .required(),
});

exports.paginationQuery = Joi.object({
  max_entry: Joi.number(),
  current_page: Joi.number(),
  name: Joi.string().min(1),
});
