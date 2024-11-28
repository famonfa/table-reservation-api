import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import restaurants from './routes/restaurants';
import reservations from './routes/reservations';
import tables from './routes/tables';
import cors from 'cors';
import managers from './routes/managers';
import users from './routes/user';
import bodyParser from 'body-parser';



dotenv.config();



const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
  }));

app.use('/api/restaurants', restaurants);
app.use('/api/reservations', reservations);
app.use('/api/tables', tables);
app.use('/api/managers', managers);
app.use('/api/users', users);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});