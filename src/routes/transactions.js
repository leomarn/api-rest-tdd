const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', async (request, response, next) => {
    try {
      const result = await app.services.transactions.find(request.user.id);
      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
