const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', async (request, response, next) => {
    try {
      const transfers = await app.services.transfers.find({
        user_id: request.user.id,
      });

      return response.status(200).json(transfers);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (request, response, next) => {
    try {
      const transfer = await app.services.transfers.create({
        ...request.body,
        user_id: request.user.id,
      });

      return response.status(201).json(transfer[0]);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
