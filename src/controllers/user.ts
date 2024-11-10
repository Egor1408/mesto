import { Request, Response } from 'express';
import User from '../models/user';
import errorsHandler from '../errorsHandler/errorsHandler';

class UserController {
  static createUser(req: Request, res: Response) {
    const { name, about, avatar } = req.body;

    User.create({ name, about, avatar })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          errorsHandler(res, 400);
        } else {
          errorsHandler(res, 500);
        }
      });
  }

  static getUserList(req: Request, res: Response) {
    User.find()
      .then((usersList) => res.json(usersList))
      .catch(() => {
        errorsHandler(res, 500);
      });
  }

  static getUserById(req: Request, res: Response) {
    const { id } = req.params;

    User.findById(id)
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'CastError') {
          errorsHandler(res, 404);
        } else {
          errorsHandler(res, 500);
        }
      });
  }

  static updateUser(req: Request, res: Response) {
    const { _id, name, about } = req.body;
    User.findByIdAndUpdate(_id, { name, about }, { new: true })
      .then((updatedUser) => res.send(updatedUser))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          errorsHandler(res, 400);
        } else if (err.name === 'CastError') {
          errorsHandler(res, 404);
        } else {
          errorsHandler(res, 500);
        }
      });
  }

  static updateUserAvatar(req: Request, res: Response) {
    const { _id, avatar } = req.body;

    User.findByIdAndUpdate(_id, { avatar }, { new: true })
      .then((updatedUser) => res.send(updatedUser))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          errorsHandler(res, 400);
        } else if (err.name === 'CastError') {
          errorsHandler(res, 404);
        } else {
          errorsHandler(res, 500);
        }
      });
  }
}

export default UserController;
