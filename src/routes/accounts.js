module.exports = (app) => {
  const findAll = async (request, response) => {
    const accounts = await app.services.accounts.findAll();
    response.status(200).json(accounts);
  };
  const create = async (request, response) => {
    const result = await app.services.accounts.create(request.body);
    return response.status(201).send(result[0]);
  };

  return { findAll, create };
};
