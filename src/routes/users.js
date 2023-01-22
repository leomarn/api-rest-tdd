const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', async (request, response) => {
    const users = await app.services.users.findAll();
    response.status(200).json(users);
  });

  router.post('/', async (request, response) => {
    try {
      const result = await app.services.users.create(request.body);
      return response.status(201).send(result[0]);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  });

  return router;
};
