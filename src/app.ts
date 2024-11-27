import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';

const PORT = 3000;
const DB_URL = 'mongodb://127.0.0.1:27017/mestodb';

const app = express();
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6727a7e716b3a365da03fce1',
  };

  next();
});
app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});
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
