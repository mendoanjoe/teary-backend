const Joi = require('@hapi/joi');

exports.roleCreationSchema = Joi.object({
  deletable: Joi.boolean(),
  name: Joi.string().required(),
  rules: Joi.object()
    .pattern(Joi.string(), Joi.array().items(Joi.string()))
    .required(),
});

exports.roleUpdateSchema = Joi.object({
  deletable: Joi.boolean(),
  name: Joi.string().required(),
  rules: Joi.object()
    .pattern(Joi.string(), Joi.array().items(Joi.string()))
    .required(),
});

exports.roleFetchSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required(),
});

exports.roleDeletionSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required(),
});

exports.roleAssignmentSchema = Joi.object({
  role_id: Joi.string()
    .uuid()
    .required(),
  user_id: Joi.string()
    .uuid()
    .required(),
});

exports.rolePaginationSchema = Joi.object({
  current_page: Joi.number().min(1),
  max_entry: Joi.number().min(1),
  name: Joi.string().min(1),
});
