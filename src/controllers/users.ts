import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/users';
import { IUser } from '../interfaces/users';
import statusCodes from '../constants';
import BadRequestError from '../errors/badRequest';
import ConflictError from '../errors/conflictError';
import NotFoundError from '../errors/notFoundError';
import UnauthorizedError from '../errors/unautorizedError';

const WEEK_TIME = 1000 * 60 * 60 * 24 * 7;

class UserController {
  static createUser(req: Request, res: Response, next: NextFunction) {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;

    bcrypt.hash(password, 10)
      .then((hash) => User.create(
        {
          name,
          about,
          avatar,
          email,
          password: hash,
        },
      )
        .then((user: IUser) => res.status(201).send(user))
        .catch((err) => {
          if (err.code === 11000) {
            return next(
              new ConflictError('Пользователь с данной почтой уже существует'),
            );
          }

          if (err.statusCode === statusCodes.BAD_REQUEST) {
            return next(new BadRequestError('Неверные данные пользователя'));
          }

          return next(err);
        }));
  }

  static getUserList(req: Request, res: Response, next: NextFunction) {
    User.find()
      .orFail(() => new NotFoundError('Пользователи не найдены'))
      .then((users) => res.send(users))
      .catch(next);
  }

  static getUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    User.findById(id)
      .orFail(() => new NotFoundError('Пользователь с указанным id не найден'))
      .then((user: IUser) => res.send(user))
      .catch(next);
  }

  static updateUser(req: Request, res: Response, next: NextFunction) {
    const { _id, name, about } = req.body;

    User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
      .orFail(() => new NotFoundError('Пользователь с указанным id не найден'))
      .then((updatedUser: IUser) => res.send(updatedUser))
      .catch(next);
  }

  static updateUserAvatar(req: Request, res: Response, next: NextFunction) {
    const { _id, avatar } = req.body;

    User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
      .orFail(() => new NotFoundError('Пользователь с указанным id не найден'))
      .then((updatedUser: IUser) => res.send(updatedUser))
      .catch(next);
  }

  static login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    User.findOne({ email })
      .select('+password')
      .then((user) => {
        if (!user) {
          throw new UnauthorizedError('Неверная почта или пароль. Пожалуйста, проверьте правильность ввода и попробуйте ещё раз.');
        }

        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неверная почта или пароль. Пожалуйста, проверьте правильность ввода и попробуйте ещё раз.');
          }

          return user;
        });
      })
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
          expiresIn: '7d',
        });

        res
          .cookie('jwt', token, { maxAge: WEEK_TIME, httpOnly: true })
          .send({ message: 'Авторизация прошла успешно' });
      })
      .catch(next);
  }

  static getProfileData = (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.body.user;

    User.findById(_id)
      .orFail(() => new UnauthorizedError('Требуется авторизация'))
      .then((user) => res.send(user))
      .catch(next);
  };
}

export default UserController;
