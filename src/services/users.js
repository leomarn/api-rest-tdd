const bcrypt = require('bcrypt-nodejs');
const validationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = () => app.db('users').select(['id', 'name', 'mail']);

  const findOne = (filter = {}) => app.db('users').where(filter).first();

  const getPasswordHas = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const create = async (user) => {
    if (!user.name) throw new validationError('Nome é um atributo obrigatório');
    if (!user.mail)
      throw new validationError('Email é um atributo obrigatorio');
    if (!user.password)
      throw new validationError('Senha é um atributo obrigatorio');

    const userDB = await findOne({ mail: user.mail });
    if (userDB) throw new validationError('Já existe usuário com esse email.');

    user.password = getPasswordHas(user.password);
    return app.db('users').insert(user, ['id', 'name', 'mail']);
  };

  return { findAll, create, findOne };
};
