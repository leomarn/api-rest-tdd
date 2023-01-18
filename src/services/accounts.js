const validationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = () => app.db('accounts').select();

  const findOne = (filter = {}) => app.db('accounts').where(filter).first();

  const create = (account) => {
    if (!account.name)
      throw new validationError('Nome é um atributo obrigatório');
    return app.db('accounts').insert(account, '*');
  };

  const update = (id, account) =>
    app.db('accounts').where({ id }).update(account, '*');

  const remove = (id) => app.db('accounts').where({ id }).del();

  return {
    findOne,
    findAll,
    create,
    update,
    remove,
  };
};
