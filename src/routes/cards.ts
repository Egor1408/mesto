import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import CardController from '../controllers/cards';

const cardRouter = Router();

cardRouter.get(
  '/cards',
  celebrate({
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
  }),
  CardController.getCardsList
);

cardRouter.post(
  '/cards',
  celebrate({
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .pattern(
          /^(https?:\/\/)(w{3}\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?(#)?$/,
        ),
      user: Joi.object(),
    }),
  }),
  CardController.createCard
);

cardRouter.delete(
  '/cards/:id',
  celebrate({
    params: {
      cardId: Joi.string().alphanum().length(24).required(),
    },
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
  }),
  CardController.deleteCardById
);

cardRouter.put(
  '/cards/:id/likes',
  celebrate({
    params: {
      cardId: Joi.string().alphanum().length(24).required(),
    },
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
  }),
  CardController.likeCard
);

cardRouter.delete(
  '/cards/:id/likes',
  celebrate({
    params: {
      cardId: Joi.string().alphanum().length(24).required(),
    },
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
  }),
  CardController.dislikeCard
);

export default cardRouter;
