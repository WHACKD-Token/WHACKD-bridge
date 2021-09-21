import express from 'express';
import mongoose from 'mongoose'
import router from './routes';
import * as dotenv from 'dotenv';
import cors from 'cors';

import notFoundHandler from './middleware/notFoundHandler';
import genericErrorHandler from './middleware/genericErrorHandler';

const morgan = require('morgan');

const allowedOrigins = [
  'http://localhost:3000',
  'http://199.193.6.175',
  'http://66.29.138.2',
];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins
};

dotenv.config({ path: __dirname+'/.env' });

const mongoURI: string = process.env.MONGO_URI || '';

const app = express();
const port = process.env.PORT || 8080;

app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
app.use(cors(corsOptions));
app.use(express.json());
app.use('/', router);

app.use(genericErrorHandler);
app.use(notFoundHandler);

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }, (error) => {
        if (error && mongoURI === '') {
            console.error(`Failed to connect to database: no variable 'MONGO_URI' was found in .env file.`);
        } else if (error) {
            console.error(`Failed to connect to database: ${error}`);
        } else {
            console.log("Connected to database.");
        }
    });

app.listen(port, () => console.log(`Application started on port: ${port}`));

