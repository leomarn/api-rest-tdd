const express = require('express');
const indevidoError = require('../errors/indevidoError');

module.exports = (app) => {
  const router = express.Router();

  const validate = async (request, response, next) => {
    try {
      await app.services.transfers.validate({
        ...request.body,
        user_id: request.user.id,
      });
      next();
    } catch (error) {
      next(error);
    }
  };

  router.param('id', async (request, response, next) => {
    try {
      const result = await app.services.transfers.findById({
        id: request.params.id,
      });

      if (result.user_id !== request.user.id)
        throw new indevidoError('Este recurso não pertence ao usuário');
      next();
    } catch (error) {
      next(error);
    }
  });

  router.get('/', async (request, response, next) => {
    try {
      const result = await app.services.transfers.find({
        user_id: request.user.id,
      });

      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (request, response, next) => {
    try {
      const result = await app.services.transfers.findById({
        id: request.params.id,
      });

      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', validate, async (request, response, next) => {
    try {
      const result = await app.services.transfers.create({
        ...request.body,
        user_id: request.user.id,
      });

      return response.status(201).json(result[0]);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', validate, async (request, response, next) => {
    try {
      const result = await app.services.transfers.update(request.params.id, {
        ...request.body,
        user_id: request.user.id,
      });

      return response.status(200).json(result[0]);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', async (request, response, next) => {
    try {
      const result = await app.services.transfers.remove(request.params.id);

      return response.status(204).json();
    } catch (error) {
      next(error);
    }
  });

  return router;
};
