const validationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (userId) => app.db('accounts').where({ user_id: userId });

  const findOne = (filter = {}) => app.db('accounts').where(filter).first();

  const create = async (account) => {
    if (!account.name)
      throw new validationError('Nome é um atributo obrigatório');

    const accDb = await findOne({
      name: account.name,
      user_id: account.user_id,
    });

    if (accDb) throw new validationError('Já existe uma conta com esse nome');

    return await app.db('accounts').insert(account, '*');
  };

  const update = (id, account) =>
    app.db('accounts').where({ id }).update(account, '*');

  const remove = async (id) => {
    const transaction = await app.services.transactions.findOne({ acc_id: id });

    if (transaction)
      throw new validationError('Essa conta possui transações associadas');

    return app.db('accounts').where({ id }).del();
  };

  return {
    findOne,
    findAll,
    create,
    update,
    remove,
  };
};
