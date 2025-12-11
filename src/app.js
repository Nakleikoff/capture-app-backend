import express from 'express';
import dotenv from 'dotenv';
import helmet  from 'helmet';
import {cors} from './middleware/cors.js';


dotenv.config();

const app = express();

app.use(helmet());
app.use(
    cors([
        "http://localhost:3000",
        "https://capture-app-frontend.vercel.app" //adjust once we deploy
    ])
)

export {app};