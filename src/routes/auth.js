const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const validationError = require('../errors/validationError');

const secret = 'Segredo!';

module.exports = (app) => {
  const signin = async (request, response, next) => {
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
  };

  return { signin };
};
