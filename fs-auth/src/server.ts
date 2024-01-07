import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/config.env' });

console.log(__dirname);
console.log(process.env.PORT);

import app from './app';

const port = process.env.PORT;
const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}.`)
);
