const Joi = require('@hapi/joi');

exports.createTestcaseSchema = Joi.object({
  problem_id: Joi.string()
    .uuid()
    .required(),
  judge_script: Joi.string().required(),
  input: Joi.string().required(),
  output: Joi.string().required(),
});

exports.getTestcaseSchema = Joi.object({
  testcaseId: Joi.string()
    .uuid()
    .required(),
});

exports.paginationQuery = Joi.object({
  max_entry: Joi.number(),
  current_page: Joi.number(),
});

exports.updateTestcaseSchema = Joi.object({
  problem_id: Joi.string().uuid(),
  judge_script: Joi.string(),
  input: Joi.string(),
  output: Joi.string(),
});
