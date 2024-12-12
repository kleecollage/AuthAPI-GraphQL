import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDatabase } from './config/database.config';
import { authRouter } from './routes/auth.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);
app.listen(process.env.PORT, async () => {
  console.log('Server running on port: ', process.env.PORT)
  await connectDatabase();
})