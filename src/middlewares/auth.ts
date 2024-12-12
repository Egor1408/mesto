import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unautorizedError';
import CONFIG from '../config';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError('Требуется авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, CONFIG.JWT_TOKEN);
  } catch (err) {
    return next(new UnauthorizedError('Требуется авторизация'));
  }

  req.body.user = payload;

  return next();
};

export default auth;
