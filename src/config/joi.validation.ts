import * as Joi from 'joi'

export const JoiValidationSchema = Joi.object({
  MONGODB: Joi.required(),
  PORT: Joi.number().default(3005),
  DEFAULT_PAGINATION_LIMIT: Joi.number().default(6)
})