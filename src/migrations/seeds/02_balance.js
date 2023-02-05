/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('users').insert([
    {
      id: 888880,
      name: 'User #3',
      mail: 'user3@mail.com',
      password: '$2a$10$uCIFQjASyROIYFmw/D7FKOkKjfv.NGHluwvh76osHXhmHZ5qNTupa',
    },
    {
      id: 888881,
      name: 'User #4',
      mail: 'user4@mail.com',
      password: '$2a$10$uCIFQjASyROIYFmw/D7FKOkKjfv.NGHluwvh76osHXhmHZ5qNTupa',
    },
  ]);
  await knex('accounts').insert([
    { id: 888882, name: 'Acc saldo principal', user_id: 888880 },
    { id: 888883, name: 'Acc saldo secundário', user_id: 888880 },
    { id: 888884, name: 'Acc alternativa 1', user_id: 888881 },
    { id: 888885, name: 'Acc alternativa  2', user_id: 888881 },
  ]);
};
