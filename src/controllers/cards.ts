import { NextFunction, Request, Response } from 'express';
import Card from '../models/cards';
import { ICard } from '../interfaces/cards';
import BadRequestError from '../errors/badRequest';
import ForbiddenError from '../errors/forbidError';
import NotFoundError from '../errors/notFoundError';
import statusCodes from '../constants';

class CardController {
  static createCard(req: Request, res: Response, next: NextFunction) {
    const { name, link } = req.body;

    return Card.create({ name, link, owner: req.body.user._id })
      .then((card) => {
        res.status(statusCodes.CREATED).send(card);
      })
      .catch((err) => {
        if (err.statusCode === statusCodes.BAD_REQUEST) {
          return next(new BadRequestError('Неверные данные карточки'));
        }

        return next(err);
      });
  }

  static getCardsList(req: Request, res: Response, next: NextFunction) {
    Card.find({})
      .then((cardsList: ICard[]) => res.send(cardsList))
      .catch(next);
  }

  static deleteCardById(req: Request, res: Response, next: NextFunction) {
    const { cardId } = req.params;

    Card.findById(cardId)
      .orFail(new NotFoundError('Карточка с указанным id не найдена'))
      .then((card: ICard) => {
        if (card.owner.toString() === req.body.user._id) {
          Card.findByIdAndDelete(req.params.cardId)
            .then(() => res.send(card));
        } else {
          next(new ForbiddenError('Нельзя удалять чужие карточки'));
        }
      })
      .catch(next);
  }

  static likeCard(req: Request, res: Response, next: NextFunction) {
    const { cardId } = req.params;
    const userId = req.body.user._id;

    Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
      .orFail(() => new NotFoundError('Карточка с указанным id не найдена'))
      .then((card: ICard) => res.send(card))
      .catch(next);
  }

  static dislikeCard(req: Request, res: Response, next: NextFunction) {
    const { cardId } = req.params;
    const userId = req.body.user._id;

    Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
      .orFail(() => new NotFoundError('Карточка с указанным id не найдена'))
      .then((card: ICard) => res.send(card))
      .catch(next);
  }
}

export default CardController;
