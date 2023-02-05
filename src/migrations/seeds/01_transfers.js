/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('transactions').del();
  await knex('transfers').del();
  await knex('accounts').del();
  await knex('users').del();

  await knex('users').insert([
    {
      id: 999990,
      name: 'User #1',
      mail: 'user1@mail.com',
      password: '$2a$10$uCIFQjASyROIYFmw/D7FKOkKjfv.NGHluwvh76osHXhmHZ5qNTupa',
    },
    {
      id: 999991,
      name: 'User #2',
      mail: 'user2@mail.com',
      password: '$2a$10$uCIFQjASyROIYFmw/D7FKOkKjfv.NGHluwvh76osHXhmHZ5qNTupa',
    },
  ]);
  await knex('accounts').insert([
    { id: 999992, name: 'Acc #1', user_id: 999990 },
    { id: 999993, name: 'Acc #2', user_id: 999990 },
    { id: 999994, name: 'Acc #3', user_id: 999991 },
    { id: 999995, name: 'Acc #4', user_id: 999991 },
  ]);
  await knex('transfers').insert([
    {
      id: 999996,
      description: 'Transfer #1',
      date: new Date(),
      ammount: 100,
      acc_ori_id: 999992,
      acc_des_id: 999993,
      user_id: 999990,
    },
    {
      id: 999997,
      description: 'Transfer #2',
      date: new Date(),
      ammount: 100,
      acc_ori_id: 999994,
      acc_des_id: 999995,
      user_id: 999991,
    },
  ]);
  await knex('transactions').insert([
    {
      description: 'Transfer from accO #1',
      date: new Date(),
      ammount: -100,
      type: 'O',
      acc_id: 999992,
      transfer_id: 999996,
    },
    {
      description: 'Transfer from accD #1',
      date: new Date(),
      ammount: 100,
      type: 'I',
      acc_id: 999993,
      transfer_id: 999996,
    },
    {
      description: 'Transfer from accO #2',
      date: new Date(),
      ammount: -100,
      type: 'O',
      acc_id: 999994,
      transfer_id: 999997,
    },
    {
      description: 'Transfer from accD #2',
      date: new Date(),
      ammount: 100,
      type: 'I',
      acc_id: 999995,
      transfer_id: 999997,
    },
  ]);
};
