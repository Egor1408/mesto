import { Request, Response } from 'express';
import Card from '../models/card';
import errorsHandler from '../errorsHandler/errorsHandler';

class CardController {
  static createCard(req: Request, res: Response) {
    const { name, link } = req.body;
    const owner = req.user._id;

    Card.create({ name, link, owner })
      .then((card) => res.send(card))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          errorsHandler(res, 400);
        } else {
          errorsHandler(res, 500);
        }
      });
  }

  static getCardsList(req: Request, res: Response) {
    Card.find()
      .then((cardsList) => res.send(cardsList))
      .catch(() => {
        errorsHandler(res, 500);
      });
  }

  static deleteCardById(req: Request, res: Response) {
    const { id } = req.params;

    Card.findByIdAndDelete(id)
      .then((card) => res.send(card))
      .catch((err) => {
        if (err.name === 'CastError') {
          errorsHandler(res, 404, 'Карточка с таким ID не найдена');
        } else {
          errorsHandler(res, 500);
        }
      });
  }

  static likeCard(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user._id;

    Card.findByIdAndUpdate(id, { $addToSet: { likes: userId } }, { new: true })
      .then((card) => res.send(card))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          errorsHandler(res, 400);
        } else if (err.name === 'CastError') {
          errorsHandler(res, 404, 'Карточка с таким ID не найдена');
        } else {
          errorsHandler(res, 500);
        }
      });
  }

  static dislikeCard(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user._id;

    Card.findByIdAndUpdate(id, { $addToSet: { likes: userId } }, { new: true })
      .then((card) => res.send(card))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          errorsHandler(res, 400);
        } else if (err.name === 'CastError') {
          errorsHandler(res, 404, 'Карточка с таким ID не найдена');
        } else {
          errorsHandler(res, 500);
        }
      });
  }
}

export default CardController;
