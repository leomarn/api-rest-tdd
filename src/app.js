// import express from 'express';
const express = require('express');
const consign = require('consign');
const knex = require('knex');
const knexfile = require('../knexfile');

const app = express();
app.use(express.json());

app.db = knex(knexfile.test);

consign({ cwd: 'src', verbose: false })
  .include('./config/middlewares.js')
  .then('./services')
  .then('./routes')
  .then('./config/routes.js')
  .into(app);

app.get('/', (request, response) => response.status(200).send());

// app.db
//   .on('query', (query) =>
//     console.log({
//       sql: query.sql,
//       bindings: query.bindings ? query.bindings.join(',') : '',
//     })
//   )
//   .on('query-response', (response) => console.log(response))
//   .on('error', (error) => console.log(error));

// export default app;
module.exports = app;
