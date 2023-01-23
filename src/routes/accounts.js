const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', async (request, response, next) => {
    try {
      const accounts = await app.services.accounts.findAll(request.user.id);
      response.status(200).json(accounts);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (request, response, next) => {
    try {
      const account = await app.services.accounts.findOne({
        id: request.params.id,
      });
      response.status(200).json(account);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (request, response, next) => {
    try {
      const result = await app.services.accounts.create({
        ...request.body,
        user_id: request.user.id,
      });
      return response.status(201).send(result[0]);
    } catch (error) {
      return next(error);
    }
  });

  router.put('/:id', async (request, response, next) => {
    try {
      const updated = await app.services.accounts.update(
        request.params.id,
        request.body
      );
      response.status(200).json(updated[0]);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', async (request, response) => {
    try {
      await app.services.accounts.remove(request.params.id);
      response.status(204).json();
    } catch (error) {
      next(error);
    }
  });

  return router;
};
