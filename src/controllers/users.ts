import { Request, Response } from 'express';
import User from '../models/users';
import errorsHandler from '../errorsHandler/errorsHandler';

const VALID_ERROR = 400;
const NOT_FOUND_ERROR = 404;
const UNDEFINED_ERROR = 500;

class UserController {
  static createUser(req: Request, res: Response) {
    const { name, about, avatar } = req.body;

    User.create({ name, about, avatar })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          errorsHandler(res, VALID_ERROR);
        } else {
          errorsHandler(res, UNDEFINED_ERROR);
        }
      });
  }

  static getUserList(req: Request, res: Response) {
    User.find()
      .then((usersList) => res.json(usersList))
      .catch(() => {
        errorsHandler(res, UNDEFINED_ERROR);
      });
  }

  static getUserById(req: Request, res: Response) {
    const { id } = req.params;

    User.findById(id)
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'CastError') {
          errorsHandler(res, NOT_FOUND_ERROR);
        } else {
          errorsHandler(res, UNDEFINED_ERROR);
        }
      });
  }

  static updateUser(req: Request, res: Response) {
    const { _id, name, about } = req.body;
    User.findByIdAndUpdate(_id, { name, about }, { new: true })
      .then((updatedUser) => res.send(updatedUser))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          errorsHandler(res, VALID_ERROR);
        } else if (err.name === 'CastError') {
          errorsHandler(res, NOT_FOUND_ERROR);
        } else {
          errorsHandler(res, UNDEFINED_ERROR);
        }
      });
  }

  static updateUserAvatar(req: Request, res: Response) {
    const { _id, avatar } = req.body;

    User.findByIdAndUpdate(_id, { avatar }, { new: true })
      .then((updatedUser) => res.send(updatedUser))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          errorsHandler(res, VALID_ERROR);
        } else if (err.name === 'CastError') {
          errorsHandler(res, NOT_FOUND_ERROR);
        } else {
          errorsHandler(res, UNDEFINED_ERROR);
        }
      });
  }
}

export default UserController;
