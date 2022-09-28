require('dotenv').config();
const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('users').insert([
    {
      first_name: 'Evans',
      last_name: 'Teiko',
      email: 'phormulabackup@gmail.com',
      password: bcrypt.hashSync('password', Number(process.env.SALT)),
    },
  ]);
  await knex('user_roles').del();
  await knex('user_roles').insert([{ user_id: 1, role_id: 1 }]);
};
