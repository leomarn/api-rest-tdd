module.exports = (app) => {
  const findAll = async (request, response) => {
    const accounts = await app.services.accounts.findAll();
    response.status(200).json(accounts);
  };
  const findOne = async (request, response) => {
    const account = await app.services.accounts.findOne({
      id: request.params.id,
    });
    response.status(200).json(account);
  };
  const create = async (request, response) => {
    const result = await app.services.accounts.create(request.body);
    return response.status(201).send(result[0]);
  };

  const update = async (request, response) => {
    const updated = await app.services.accounts.update(
      request.params.id,
      request.body
    );
    return response.status(200).json(updated[0]);
  };

  return {
    findOne,
    findAll,
    create,
    update,
  };
};
