const express = require('express');
const indevidoError = require('../errors/indevidoError');

module.exports = (app) => {
  const router = express.Router();

  router.param('id', async (request, response, next) => {
    try {
      const transactionSeachId = await app.services.transactions.find(
        request.user.id,
        { 'transactions.id': request.params.id }
      );

      if (transactionSeachId.length > 0) next();
      else throw new indevidoError('Este recurso não pertence ao usuário');
    } catch (error) {
      next(error);
    }
  });

  router.get('/', async (request, response, next) => {
    try {
      const result = await app.services.transactions.find(request.user.id);
      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  router.get('/:id', async (request, response, next) => {
    try {
      const result = await app.services.transactions.findOne({
        id: request.params.id,
      });
      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  router.post('/', async (request, response, next) => {
    try {
      const created = await app.services.transactions.create(request.body);
      return response.status(201).json(created);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', async (request, response, next) => {
    try {
      const updated = await app.services.transactions.update(
        request.params.id,
        request.body
      );
      return response.status(200).json(updated[0]);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', async (request, response, next) => {
    try {
      await app.services.transactions.remove(request.params.id);

      return response.status(204).json();
    } catch (error) {
      next(error);
    }
  });

  return router;
};
