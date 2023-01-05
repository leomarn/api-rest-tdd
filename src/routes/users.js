module.exports = (app) => {
  const findAll = async (request, response) => {
    const users = await app.db('users').select();
    response.status(200).json(users);
  };

  const create = async (request, response) => {
    const result = await app.db('users').insert(request.body, '*');
    response.status(201).send(result[0]);
  };

  return { findAll, create };
};
