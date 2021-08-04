import dotenv from 'dotenv';
dotenv.config();
// const ConnectDB = require('./config/db');
import ConnectDB from './config/db';
import routes from './routes/index';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';



// Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());


// Routes
app.use('/api', routes.authRouter);
app.use('/api', routes.userRouter);
app.use('/api', routes.categoryRouter);






// Database
// connect MongoDB
ConnectDB();




// server listenning
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});