import express, { Request, Response } from 'express';
import dotenv from "dotenv"


dotenv.config()
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', async(req, res) => {
  try{
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  }catch (error ){
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});