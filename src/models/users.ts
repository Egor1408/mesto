import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { IUser, IUserModel } from '../interfaces/users';
import { UnauthorizedError } from '../errors/CustomErrors';

const User = new mongoose.Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 200,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    versionKey: false,
  },
);

User.static(
  'findUserByCredentials',
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
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
      });
  },
);

export default mongoose.model<IUser, IUserModel>('User', User);
