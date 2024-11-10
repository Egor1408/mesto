import mongoose from 'mongoose';
import { IUser } from '../interfaces/user';

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      require: true,
      minlength: 2,
      maxlength: 200,
    },
    avatar: {
      type: String,
      require: true,
    },
  },
  {
    versionKey: false,
  },
);

export default mongoose.model<IUser>('User', User);
