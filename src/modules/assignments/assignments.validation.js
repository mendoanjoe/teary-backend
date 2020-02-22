const Joi = require('@hapi/joi');

exports.createAssignmentSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  is_published: Joi.boolean(),
  start_date: Joi.date(),
  end_date: Joi.date(),
});

exports.getAssignmentSchema = Joi.object({
  assignmentId: Joi.string().uuid().required(),
});

exports.paginationQuery = Joi.object({
  max_entry: Joi.number(),
  current_page: Joi.number(),
});

exports.updateAssignmentSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  is_published: Joi.boolean(),
  start_date: Joi.date(),
  end_date: Joi.date(),
});
