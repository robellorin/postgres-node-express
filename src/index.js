import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import 'regenerator-runtime/runtime';
import routes from './routes';
import database from './middlewares/database';

const app = express();

// Application-Level Middleware

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

app.use('/api/users', database, routes.user);
app.use('/api/interceptionRules', database, routes.interceptionRules);
app.use('/api/reload', database, routes.reload);
app.use('/api/token', routes.token);
// Start

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);
