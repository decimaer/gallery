import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
// import xss from "xss-clean";
import hpp from 'hpp';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import imageRouter from './routes/imageRoutes';

const isDev = process.env.NODE_ENV === 'development';
console.log(process.env.NODE_ENV);

const app = express();

//Express middlewares etc
// set security http headers
// app.use(helmet());

// CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// Dev logging
if (isDev) {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in one hour.',
});
app.use('/api', limiter);

// body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization againt XSS
// FIXME: not working with ts types
// app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);

app.use(cookieParser());

app.use('/images', imageRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

export default app;
