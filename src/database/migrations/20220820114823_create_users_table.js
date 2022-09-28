/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.bigIncrements('id');
    table.string('first_name', 255).notNullable();
    table.string('last_name', 255).notNullable();
    table.string('email').unique();
    table.timestamp('email_verified_at').nullable();
    table.string('password');
    // table.rememberToken();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
