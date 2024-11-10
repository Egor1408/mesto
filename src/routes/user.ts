import { Router } from 'express';
import UserController from '../controllers/user';

const userRouter = Router();

userRouter.post('/users', UserController.createUser);

userRouter.get('/users', UserController.getUserList);

userRouter.get('/users/:id', UserController.getUserById);

userRouter.patch('/users/me', UserController.updateUser);

userRouter.patch('/users/me/avatar', UserController.updateUserAvatar);

export default userRouter;
