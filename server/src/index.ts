import express, { Request, Response } from 'express';
import agencesRoutes from './routes/agences.routes';
import dotenv from "dotenv"
import { pool } from './db';

dotenv.config()
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());




app.get('/health', async(req, res) => {
   try {
    await pool.query('SELECT 3');
    res.status(200).json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

app.use('/agences', agencesRoutes);


app.listen(port, () => {
  console.log(`Server is running on port  ${port} great!`);
});