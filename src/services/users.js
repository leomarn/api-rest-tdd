const validationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => app.db('users').where(filter).select();

  const create = async (user) => {
    if (!user.name) throw new validationError('Nome é um atributo obrigatório');
    if (!user.mail)
      throw new validationError('Email é um atributo obrigatorio');
    if (!user.password)
      throw new validationError('Senha é um atributo obrigatorio');

    const userDB = await findAll({ mail: user.mail });
    if (userDB && userDB.length > 0) {
      throw new validationError('Já existe usuário com esse email.');
    }
    return app.db('users').insert(user, '*');
  };

  return { findAll, create };
};
