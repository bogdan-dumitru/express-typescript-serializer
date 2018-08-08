import Joi from "joi";

export const get = () => {
  return {
    params: {
      videoId: Joi.number()
        .integer()
        .positive()
        .required()
    }
  };
};
