import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
// import xss from "xss-clean";
import hpp from 'hpp';
import cors from 'cors';

// import userRouter from './routes/userRoutes';
// import taskRouter from './routes/taskRoutes';
import schema from './controllers/graphqlController';
// import { graphqlHTTP } from 'express-graphql';
// import { createHandler } from 'graphql-http/lib/use/express';
// import expressPlayground from 'graphql-playground-middleware-express';
import { createYoga } from 'graphql-yoga';
import { graphql } from 'graphql';

const isDev = process.env.NODE_ENV === 'development';
console.log(process.env.NODE_ENV);

const app = express();

//Express middlewares etc
// set security http headers
// app.use(helmet());

//Use cors for client side requests
// if (!isDev) {
//   app.use(cors());
// }

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

// serving static files
// app.use(express.static(__dirname + process.env.DIR_STATIC_FILES));
// Routes
// app.use('/api/users', userRouter);

// app.use('/api/tasks', taskRouter);

app.use(
  '/',
  (req, res, next) => {
    console.log('graphql request');
    next();
  },
  createYoga({ schema })
);

// if (isDev) {
//   app.use('/api/playground', expressPlayground({ endpoint: '/api/graphql' }));
// }

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

export default app;
