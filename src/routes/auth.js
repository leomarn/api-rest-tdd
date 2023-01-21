const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

const secret = 'Segredo!';

module.exports = (app) => {
  const signin = async (request, response, next) => {
    const user = await app.services.users.findOne({ mail: request.body.mail });

    try {
      if (bcrypt.compareSync(request.body.password, user.password)) {
        const payload = {
          id: user.id,
          name: user.name,
          mail: user.mail,
        };
        const token = jwt.encode(payload, secret);
        return response.status(200).json({ token });
      }
    } catch (error) {
      return next(error);
    }
  };

  return { signin };
};
