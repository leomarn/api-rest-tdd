const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', async (request, response) => {
    const accounts = await app.services.accounts.findAll();
    response.status(200).json(accounts);
  });

  router.get('/:id', async (request, response) => {
    const account = await app.services.accounts.findOne({
      id: request.params.id,
    });
    response.status(200).json(account);
  });

  router.post('/', async (request, response, next) => {
    try {
      const result = await app.services.accounts.create(request.body);
      return response.status(201).send(result[0]);
    } catch (error) {
      return next(error);
    }
  });

  router.put('/:id', async (request, response) => {
    const updated = await app.services.accounts.update(
      request.params.id,
      request.body
    );
    return response.status(200).json(updated[0]);
  });

  router.delete('/:id', async (request, response) => {
    await app.services.accounts.remove(request.params.id);
    return response.status(204).json();
  });

  return router;
};
