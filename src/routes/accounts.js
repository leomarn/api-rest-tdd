const express = require('express');
const indevidoError = require('../errors/indevidoError');

module.exports = (app) => {
  const router = express.Router();

  router.param('id', async (request, response, next) => {
    try {
      const userSeachId = await app.services.accounts.findOne({
        id: request.params.id,
      });

      if (userSeachId.user_id != request.user.id)
        throw new indevidoError('Este recurso não pertence ao usuário');
      else next();
    } catch (error) {
      next(error);
    }
  });

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

      // if (account.user_id != request.user.id)
      //   return response
      //     .status(403)
      //     .json({ error: 'Este recurso não pertence ao usuário' });

      return response.status(200).json(account);
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
      // const account = await app.services.accounts.findOne({
      //   id: request.params.id,
      // });

      // if (account.user_id != request.user.id)
      //   return response
      //     .status(403)
      //     .json({ error: 'Este recurso não pertence ao usuário' });

      const updated = await app.services.accounts.update(
        request.params.id,
        request.body
      );

      return response.status(200).json(updated[0]);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', async (request, response) => {
    try {
      // const account = await app.services.accounts.findOne({
      //   id: request.params.id,
      // });

      // if (account.user_id != request.user.id)
      //   return response
      //     .status(403)
      //     .json({ error: 'Este recurso não pertence ao usuário' });

      await app.services.accounts.remove(request.params.id);
      response.status(204).json();
    } catch (error) {
      next(error);
    }
  });

  return router;
};
