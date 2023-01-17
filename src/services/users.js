module.exports = (app) => {
  const findAll = (filter = {}) => app.db('users').where(filter).select();
  const create = async (user) => {
    if (!user.name) return { error: 'Nome é um atributo obrigatório' };
    if (!user.mail) return { error: 'Email é um atributo obrigatorio' };
    if (!user.password) return { error: 'Senha é um atributo obrigatorio' };

    const userDB = await findAll({ mail: user.mail });
    if (userDB && userDB.length > 0) {
      return { error: 'Já existe usuário com esse email.' };
    }
    return app.db('users').insert(user, '*');
  };

  return { findAll, create };
};
