import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectMongoDb from './connectDB/conn.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import uploadRoutes from './routes/uploadRoutes.js';
import placesRoute from './routes/placesRoute.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { dirname, join } from 'path'
import { fileURLToPath } from 'url';

//nodemon index.js

dotenv.config({ path: '../.env' });
const app = express();

const corsOptions = {
    credentials: true,
    origin: 'http://localhost:5173'
};
const port = process.env.PORT || 4000

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors(corsOptions));
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get('/test', (req, res) => {
    res.json('test ok');
});
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/place', placesRoute);
app.use('/api/bookings', bookingRoutes);

app.use('/uploads', express.static(join(__dirname, '/uploads')));

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    console.log(`${__dirname}`);
    connectMongoDb();
});