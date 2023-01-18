/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// eslint-disable-next-line arrow-body-style
exports.up = (knex) => {
  return knex.schema.createTable('accounts', (t) => {
    t.increments('id').primary();
    t.string('name').notNullable();
    t.integer('user_id').references('id').inTable('users').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// eslint-disable-next-line arrow-body-style
exports.down = (knex) => {
  return knex.schema.dropTable('accounts');
};
