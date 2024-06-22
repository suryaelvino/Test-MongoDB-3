import express, { Request, Response } from 'express';
import router from './route/route';
import { connectToMongoDB } from './database/database';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(router);
app.use(cors());

connectToMongoDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

