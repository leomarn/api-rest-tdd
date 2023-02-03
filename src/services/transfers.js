module.exports = (app) => {
  const find = (filter = {}) => app.db('transfers').where(filter).select();

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

  return { find, create };
};
