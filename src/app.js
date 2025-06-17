import express from 'express';
import swaggerUI from 'swagger-ui-express';
import specs from './config/swagger/swagger.js';
import dbClient from "./config/dbClient.js"
import passport from './presentationLayer/middlewares/authMiddleware.js';
import { router } from './presentationLayer/routes/index.routes.js';
import { envs } from './config/environments/environments.js';
import cors from 'cors';
import { AppError } from './businessLogicLayer/errors/error.js';
import { globalErrorHandler } from './helpers/globalErrorHandler.js';

export const API_PREFIX = "/QatuService/v1";


const app = express();

app.use(cors({
    origin: envs.CLIENT_URL,
    methods: ['GET','POST','PUT','DELETE','PATCH'],
    credentials: true
}));

app.use(express.json());
app.use(passport.initialize());
app.use(API_PREFIX, router);

app.get('/html', (req, res) => {
    res.send('<h1>Hello, this is an HTML response!</h1><p>Welcome to the world of Express.js.</p>');
})

app.get('/demo', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Express.js Greeting</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          padding: 40px;
          text-align: center;
        }
        h1 {
          color: #007BFF;
          font-size: 3em;
        }
        p {
          font-size: 1.2em;
          margin-top: 10px;
        }
        .card {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Hello from Scuadron Sveltica teams - Predemo</h1>
        <p>Welcome to a beautifully styled HTML response.</p>
        <p>You're successfully building web applications with Node.js and Express!</p>
      </div>
    </body>
    </html>
  `);
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use((req, res, next) => {
    const originalUrl = typeof req.originalUrl === 'string' ? req.originalUrl : '[URL no válida]';
    console.log('[404 Handler] URL recibida:', originalUrl);
    return next(new AppError(404,`${originalUrl} not found!`));
});

app.use(globalErrorHandler);

export default app;
