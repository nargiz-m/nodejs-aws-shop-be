import Joi = require("joi");

export const productSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().positive().required(),
    count: Joi.number().positive().integer().required(),
});