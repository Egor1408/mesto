import { Response } from 'express';

export default function errorsHandler(res:Response, statusCode:number, message:string = 'Пользователь с таким ID не найден') {
  if (statusCode === 400) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  } else if (statusCode === 404) {
    res.status(404).send({ message });
  } else {
    res.status(500).send({ message: 'Неизвестная ошибка сервера' });
  }
}
