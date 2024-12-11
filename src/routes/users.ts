import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import UserController from '../controllers/users';

const userRouter = Router();

userRouter.post('/signup', UserController.createUser);
userRouter.post('/signin', UserController.login);

userRouter.get(
  '/users',
  celebrate({
    cookies: Joi.object()
    .keys({
      jwt: Joi.string().required(),
    })
    .unknown(true),
  }),
  UserController.getUserList
);

userRouter.get(
  '/users/me',
  celebrate({
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
  }),
  UserController.getProfileData
);

userRouter.patch(
  '/users/me',
  celebrate({
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(200).required(),
      user: Joi.object().required(),
    }),
  }),
  UserController.updateUser
);

userRouter.patch(
  '/users/me/avatar',
  celebrate({
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .pattern(
          /^(https?:\/\/)(w{3}\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?(#)?$/,
        ),
      user: Joi.object().required(),
    }),
  }),
  UserController.updateUserAvatar
);

userRouter.get(
  '/:userId',
  celebrate({
    params: {
      userId: Joi.string().alphanum().length(24).required(),
    },
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
  }),
  UserController.getUserById,
);

export default userRouter;
