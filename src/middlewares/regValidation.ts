import { Joi, celebrate } from 'celebrate';

const signUpValidation = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(
      /^(https?:\/\/)(w{3}\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?(#)?$/,
    ),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export default signUpValidation;
