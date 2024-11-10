import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardRouter from './routes/card';

const PORT = 3000;
const DB_URL = 'mongodb://127.0.0.1:27017/mestodb';

const app = express();
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6727a7e716b3a365da03fce1', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use('/', userRouter);
app.use('/', cardRouter);

async function startApp() {
  try {
    await mongoose.connect(DB_URL);
    app.listen(PORT, () => {
      console.log('server start on', '\x1b[36m', `http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

startApp();
