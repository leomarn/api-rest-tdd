module.exports = (app) => {
  const find = (userId, filter = {}) => {
    return app
      .db('transactions')
      .join('accounts', 'accounts.id', 'acc_id')
      .where(filter)
      .andWhere('accounts.user_id', '=', userId)
      .select();
  };

  const findOne = (id) => {
    return app.db('transactions').where({ id }).first();
  };

  const create = (transaction) => {
    return app.db('transactions').insert(transaction, '*');
  };

  const update = (id, transaction) => {
    return app.db('transactions').where({ id }).update(transaction, '*');
  };

  const remove = (id) => {
    return app.db('transactions').where({ id }).del();
  };

  return { find, create, findOne, update, remove };
};
