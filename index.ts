import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import authRoute from './src/v1/routes';
import cors from 'cors';
const app = express();

const PORT = 5050;


app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json())

try {
  mongoose.connect(process.env.MONGO_URL!)
  .then(() => {
    console.log('接続完了！！');
  });
} catch (error) {
  console.log(error);
}

app.use('/api/v1', authRoute);

app.listen(PORT, () => {
  console.log('ローカルサーバー起動中');
})