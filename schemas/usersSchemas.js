import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})
  .min(2)
  .message("All fields are required!");

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string(),
})
  .min(2)
  .message("All fields are required!");

export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

export const verificationEmailSchema = Joi.object({
  email: Joi.string().email(),
})
  .min(1)
  .message("Missing required field email");
