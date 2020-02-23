const Joi = require('@hapi/joi');

exports.createSubmissionSchema = Joi.object({
  problem_id: Joi.string()
    .uuid()
    .required(),
  user_id: Joi.string()
    .uuid()
    .required(),
  bucket_name: Joi.string().required(),
  object_name: Joi.string().required(),
  scores: Joi.number().min(0),
  status: Joi.string().required(),
  logs: Joi.string(),
});

exports.getSubmissionSchema = Joi.object({
  submissionId: Joi.string()
    .uuid()
    .required(),
});

exports.paginationQuery = Joi.object({
  max_entry: Joi.number(),
  current_page: Joi.number(),
});

exports.updateSubmissionSchema = Joi.object({
  problem_id: Joi.string().uuid(),
  user_id: Joi.string().uuid(),
  bucket_name: Joi.string(),
  object_name: Joi.string(),
  scores: Joi.number().min(0),
  status: Joi.string(),
  logs: Joi.string(),
});
