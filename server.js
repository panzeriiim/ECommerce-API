/* eslint-disable no-console */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;
dotenv.config({ path: './.env' });

mongoose
  .connect(process.env.CONNECT_STRING)
  .then(() => {
    console.log('conection to database successfully');
    app.listen(PORT, () => {
      console.log('server is on port 3000!');
    });
  })
  .catch((err) => {
    console.log('something went wrong!!', err);
  });
