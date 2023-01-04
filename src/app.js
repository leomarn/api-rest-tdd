// import express from 'express';
const express = require('express');
const consign = require('consign');

const app = express();
app.use(express.json());
consign({ cwd: 'src', verbose: false })
  .include('./config/middlewares.js')
  .then('./routes')
  .then('./config/routes.js')
  .into(app);

app.get('/', (request, response) => response.status(200).send());

// export default app;
module.exports = app;
