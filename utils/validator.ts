import joi from "joi";

export const createAbegValidator = joi.object({
  title: joi.string().trim().required(),
  motivation: joi.string().trim().required(),
  detailDescription: joi.string().trim().required(),
  amountNeeded: joi.number().required(),
  // category: joi.string().lowercase().trim().required(),
});
