const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const validationError = require('../errors/validationError');

const secret = 'Segredo!';

module.exports = (app) => {
  const router = express.Router();

  router.post('/signin', async (request, response, next) => {
    const user = await app.services.users.findOne({ mail: request.body.mail });

    try {
      if (!user) throw new validationError('Usuário ou senha inválida');

      if (bcrypt.compareSync(request.body.password, user.password)) {
        const payload = {
          id: user.id,
          name: user.name,
          mail: user.mail,
        };
        const token = jwt.encode(payload, secret);
        return response.status(200).json({ token });
      } else throw new validationError('Usuário ou senha inválida');
    } catch (error) {
      return next(error);
    }
  });

  router.post('/signup', async (request, response) => {
    try {
      const result = await app.services.users.create(request.body);
      return response.status(201).send(result[0]);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  });

  return router;
};
