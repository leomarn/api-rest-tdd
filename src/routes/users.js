module.exports = (app) => {
  const findAll = async (request, response) => {
    const users = await app.services.users.findAll();
    response.status(200).json(users);
  };

  const create = async (request, response) => {
    const result = await app.services.users.create(request.body);
    if (result.error) return response.status(400).json(result);
    return response.status(201).send(result[0]);
  };

  return { findAll, create };
};
