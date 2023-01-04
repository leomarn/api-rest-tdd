// import express from 'express';

const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (request, response) => response.status(200).send());

app.get('/users', (request, response) => {
  const users = [{ nome: 'Tom Riddle', email: 'tom@riddle.com' }];
  response.status(200).json(users);
});

app.post('/users', (request, response) => {
  response.status(201).send(request.body);
});

// export default app;
module.exports = app;
