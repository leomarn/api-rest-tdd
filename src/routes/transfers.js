const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', async (request, response, next) => {
    try {
      const transfers = await app.services.transfers.find({
        user_id: request.user.id,
      });

      return response.status(200).send(transfers);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
