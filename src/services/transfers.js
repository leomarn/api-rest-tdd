const validationError = require('../errors/validationError');

module.exports = (app) => {
  const find = (filter = {}) => app.db('transfers').where(filter).select();

  const findById = (filter = {}) => app.db('transfers').where(filter).first();

  const create = async (transfer) => {
    const result = await app.db('transfers').insert(transfer, '*');
    const transferId = result[0].id;

    const transactions = [
      {
        description: `Transfer to acc #${transfer.acc_des_id}`,
        type: 'O',
        date: transfer.date,
        status: true,
        ammount: transfer.ammount * -1,
        acc_id: transfer.acc_ori_id,
        transfer_id: transferId,
      },
      {
        description: `Transfer from acc #${transfer.acc_ori_id}`,
        type: 'I',
        date: transfer.date,
        status: true,
        ammount: transfer.ammount,
        acc_id: transfer.acc_des_id,
        transfer_id: transferId,
      },
    ];

    await app.db('transactions').insert(transactions);
    return result;
  };

  const update = async (id, transfer) => {
    const result = await app
      .db('transfers')
      .where({ id })
      .update(transfer, '*');

    const transactions = [
      {
        description: `Transfer to acc #${transfer.acc_des_id}`,
        type: 'O',
        date: transfer.date,
        status: true,
        ammount: transfer.ammount * -1,
        acc_id: transfer.acc_ori_id,
        transfer_id: id,
      },
      {
        description: `Transfer from acc #${transfer.acc_ori_id}`,
        type: 'I',
        date: transfer.date,
        status: true,
        ammount: transfer.ammount,
        acc_id: transfer.acc_des_id,
        transfer_id: id,
      },
    ];

    await app.db('transactions').where({ transfer_id: id }).del();
    await app.db('transactions').insert(transactions);
    return result;
  };

  const validate = async (transfer) => {
    if (!transfer.description)
      throw new validationError('Descrição é um atributo obrigatório');
    if (!transfer.date)
      throw new validationError('Data é um atributo obrigatório');
    if (!transfer.ammount)
      throw new validationError('Valor é um atributo obrigatório');
    if (!transfer.acc_ori_id)
      throw new validationError('Conta de origem é um atributo obrigatório');
    if (!transfer.acc_des_id)
      throw new validationError('Conta de destino é um atributo obrigatório');

    if (transfer.acc_ori_id === transfer.acc_des_id)
      throw new validationError(
        'Não é possível transferir de uma conta para ela mesma'
      );

    const accounts = await app
      .db('accounts')
      .whereIn('id', [transfer.acc_des_id, transfer.acc_ori_id]);
    accounts.forEach((acc) => {
      if (acc.user_id !== parseInt(transfer.user_id, 10))
        throw new validationError(`Conta #${acc.id} não pertence ao usuário`);
    });
  };

  const remove = async (id) => {
    await app.db('transactions').where({ transfer_id: id }).del();
    return app.db('transfers').where({ id }).del();
  };

  return { find, create, validate, findById, update, remove };
};
