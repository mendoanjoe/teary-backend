const Joi = require('@hapi/joi');

exports.createProblemSchema = Joi.object({
  assignment_id: Joi.string()
    .uuid()
    .required(),
  title: Joi.string().required(),
  type: Joi.string().required(),
  body: Joi.string().required(),
  scores: Joi.number().required(),
  time_limit: Joi.number(),
  memory_limit: Joi.number(),
});

exports.getProblemSchema = Joi.object({
  problemId: Joi.string()
    .uuid()
    .required(),
});

exports.paginationQuery = Joi.object({
  max_entry: Joi.number(),
  current_page: Joi.number(),
});

exports.updateProblemSchema = Joi.object({
  assignment_id: Joi.string().uuid(),
  title: Joi.string(),
  type: Joi.string(),
  body: Joi.string(),
  scores: Joi.number(),
  time_limit: Joi.number(),
  memory_limit: Joi.number(),
});
