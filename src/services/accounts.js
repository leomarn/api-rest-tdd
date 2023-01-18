module.exports = (app) => {
  const findAll = () => app.db('accounts').select();
  const findOne = (filter = {}) => app.db('accounts').where(filter).first();
  const create = (account) => app.db('accounts').insert(account, '*');
  const update = (id, account) =>
    app.db('accounts').where({ id }).update(account, '*');

  return {
    findOne,
    findAll,
    create,
    update,
  };
};
