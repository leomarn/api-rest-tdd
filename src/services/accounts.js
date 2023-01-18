module.exports = (app) => {
  const findAll = async () => app.db('accounts').select();
  const create = async (account) => app.db('accounts').insert(account, '*');

  return { findAll, create };
};
